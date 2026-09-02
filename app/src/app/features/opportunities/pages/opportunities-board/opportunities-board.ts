import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';

import { Opportunity } from '../../models/opportunity.model';
import { OpportunityCard } from '../../components/opportunity-card/opportunity-card';
import { OpportunityDetailsPanel } from '../../components/opportunity-details-panel/opportunity-details-panel';
import {
  DEFAULT_OPPORTUNITY_FILTERS,
  OPPORTUNITY_QUICK_VIEWS,
  OPPORTUNITY_STATUSES,
  OpportunityQuickView,
} from '../../constants/opportunity.constants';

import { OpportunityStatus } from '../../types/opportunity.type';
import { OpportunityFiltersComponent } from '../../components/opportunity-filters/opportunity-filters';
import { OpportunityForm } from '../../components/opportunity-form/opportunity-form';
import { OpportunityQuickViews } from '../../components/opportunity-quick-views/opportunity-quick-views';
import { SearchInput } from '../../../../shared/components/search-input/search-input';
import { OpportunityApiService } from '../../api/opportunity-api.service';
import { CreateOpportunityCommand } from '../../commands/create-opportunity.command';
import { UpdateOpportunityCommand } from '../../commands/update-opportunity.command';
import { NoteApiService } from '../../../notes/api/note-api.service';
import { CreateNoteCommand } from '../../../notes/commands/create-note.command';
import { NextActionApiService } from '../../api/next-action-api.service';
import { CreateNextActionCommand } from '../../commands/create-next-action.command';
import { OpportunityEventApiService } from '../../api/opportunity-event-api.service';
import { CreateOpportunityEventCommand } from '../../commands/create-opportunity-event.command';
import { UpdateOpportunityEventCommand } from '../../commands/update-opportunity-event.command';
import { getCalendarDayDifference } from '../../utils/opportunity-urgency.util';
import { NEXT_ACTION_DUE_OPTIONS } from '../../constants/opportunity-filter-options.constants';

/*
  Columns act as drop zones for kanban interactions.
*/
@Component({
  selector: 'app-opportunities-board',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDropListGroup,
    OpportunityCard,
    OpportunityDetailsPanel,
    OpportunityFiltersComponent,
    OpportunityForm,
    OpportunityQuickViews,
    SearchInput,
  ],
  templateUrl: './opportunities-board.html',
  styleUrl: './opportunities-board.scss',
})
export class OpportunitiesBoard {
  private readonly opportunityApi = inject(OpportunityApiService);

  private readonly noteApi = inject(NoteApiService);

  private readonly nextActionApi = inject(NextActionApiService);

  private readonly opportunityEventApi = inject(OpportunityEventApiService);

  /*
    Opportunities are stored in a signal
    so the board can react to drag & drop updates.
  */
  readonly opportunities = signal<Opportunity[]>([]);

  /*
    Statuses are sorted once to keep the kanban
    pipeline order centralized in the constants layer.
  */
  readonly statuses = Object.values(OPPORTUNITY_STATUSES).sort((a, b) => a.order - b.order);

  readonly activeOpportunities = computed(() =>
    this.opportunities().filter((opportunity) => this.isActive(opportunity)),
  );

  /*
    Build kanban columns dynamically from statuses
    so the board structure stays configuration-driven.
  */
  readonly columns = computed(() => {
    return this.statuses.map((status) => {
      const totalOpportunities = this.opportunities().filter(
        (opportunity) => opportunity.status === status.value && this.isActive(opportunity),
      );

      const visibleOpportunities = this.visibleOpportunities().filter(
        (opportunity) => opportunity.status === status.value,
      );

      return {
        status: status.value,
        label: status.label,

        opportunities: visibleOpportunities,

        visibleCount: visibleOpportunities.length,
        totalCount: totalOpportunities.length,
      };
    });
  });

  /*
    Closed opportunities are intentionally hidden
    from the main board to keep focus on active work.
  */
  readonly activeColumns = computed(() => {
    return this.columns().filter(
      (column) => !this.isArchivedStatus(column.status),
    );
  });

  /*
    Archived opportunities remain collapsible
    to keep the main board focused and compact.
  */
  readonly showArchived = signal(false);

  /*
    Archived sections stay separated to help analyze
    wins and losses independently.
  */
  readonly lostOpportunities = computed(() => {
    return this.opportunities().filter(
      (opportunity) => opportunity.status === OPPORTUNITY_STATUSES.LOST.value,
    );
  });

  readonly wonOpportunities = computed(() => {
    return this.opportunities().filter(
      (opportunity) => opportunity.status === OPPORTUNITY_STATUSES.WON.value,
    );
  });

  /*
    Selected opportunity state is managed here
    so both the board and side panel stay synchronized.
  */
  readonly selectedOpportunity = signal<Opportunity | null>(null);

  readonly pendingStatus = signal<OpportunityStatus | null>(null);

  readonly editedOpportunity = signal<Opportunity | null>(null);

  readonly showOpportunityForm = signal(false);

  readonly detailsPanel = viewChild<OpportunityDetailsPanel>('detailsPanel');

  readonly selectedQuickView = signal<OpportunityQuickView>(OPPORTUNITY_QUICK_VIEWS.TODO.value);

  readonly search = signal('');

  readonly filtersExpanded = signal(false);

  readonly filters = signal(structuredClone(DEFAULT_OPPORTUNITY_FILTERS));

  readonly availableSources = computed(() =>
    [...new Set(this.opportunities().map((opportunity) => opportunity.source))].sort(),
  );

  /*
    Visible opportunities depend on
    the selected quick view.
  */
  readonly visibleOpportunities = computed(() => {
    return this.opportunitiesMatchingBaseFilters().filter((opportunity) =>
      this.matchesNextActionDueFilter(opportunity),
    );
  });

  readonly nextActionDueCounts = computed(() =>
    Object.fromEntries(
      NEXT_ACTION_DUE_OPTIONS.map((option) => [
        String(option.value),
        this.opportunitiesMatchingBaseFilters().filter((opportunity) =>
          this.matchesNextActionDueFilter(opportunity, [option.value]),
        ).length,
      ]),
    ),
  );

  private readonly opportunitiesMatchingBaseFilters = computed(() => {
    let opportunities = this.activeOpportunities();

    switch (this.selectedQuickView()) {
      case OPPORTUNITY_QUICK_VIEWS.TODO.value:
        opportunities = opportunities.filter((opportunity) => this.isTodo(opportunity));
        break;

      case OPPORTUNITY_QUICK_VIEWS.PREPARE.value:
        opportunities = opportunities.filter((opportunity) => this.isPreparation(opportunity));
        break;
    }

    return opportunities
      .filter((opportunity) => this.matchesSearch(opportunity))
      .filter((opportunity) => this.matchesFilters(opportunity, false));
  });

  private readonly preparationStatuses: OpportunityStatus[] = [
    OPPORTUNITY_STATUSES.INTERVIEW.value,
    OPPORTUNITY_STATUSES.PROPOSAL.value,
    OPPORTUNITY_STATUSES.NEGOTIATION.value,
  ];

  readonly todoCount = computed(
    () => this.activeOpportunities().filter((opportunity) => this.isTodo(opportunity)).length,
  );

  readonly preparationCount = computed(
    () =>
      this.activeOpportunities().filter((opportunity) => this.isPreparation(opportunity)).length,
  );

  readonly totalCount = computed(() => this.activeOpportunities().length);

  readonly activeFiltersCount = computed(() => {
    const filters = this.filters();

    return (
      filters.modalities.length +
      filters.seniorities.length +
      filters.companyTypes.length +
      filters.sources.length +
      (filters.minimumDailyRate !== null ? 1 : 0) +
      filters.nextActionDueInDays.length
    );
  });

  constructor() {
    this.opportunityApi.getAll().subscribe((opportunities) => {
      this.opportunities.set(opportunities);
    });

    /*
      Lock body scroll and register ESC closing
      while the details panel is opened.
    */
    effect((onCleanup) => {
      const selectedOpportunity = this.selectedOpportunity();

      if (!selectedOpportunity) {
        document.body.style.overflow = '';

        return;
      }

      document.body.style.overflow = 'hidden';

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          this.closeDetailsPanel();
        }
      };

      globalThis.addEventListener('keydown', handleKeyDown);

      onCleanup(() => {
        document.body.style.overflow = '';

        globalThis.removeEventListener('keydown', handleKeyDown);
      });
    });
  }

  /*
    Archived sections can be expanded on demand
    without cluttering the active pipeline.
  */
  toggleArchived(): void {
    this.showArchived.update((value) => !value);
  }

  toggleFilters(): void {
    this.filtersExpanded.update((expanded) => !expanded);
  }

  selectOpportunity(opportunity: Opportunity): void {
    this.opportunityApi.getById(opportunity.id).subscribe((opportunity) => {
      this.selectedOpportunity.set(opportunity);
    });
  }

  closeDetailsPanel(): void {
    if (!this.detailsPanel()?.canClose()) {
      return;
    }

    this.selectedOpportunity.set(null);
  }

  /*
    Moving a card between columns updates
    the underlying opportunity workflow state.
  */
  moveOpportunity(event: CdkDragDrop<Opportunity[]>, status: OpportunityStatus): void {
    const opportunity = event.item.data as Opportunity;

    if (opportunity.status === status) {
      return;
    }

    this.updateOpportunityStatus(opportunity.id, status);
  }

  /*
    Prevent invalid workflow transitions
    between archived and active states.
  */
  canDrop(drag: { data: Opportunity }, drop: CdkDropList<Opportunity[]>): boolean {
    const opportunity = drag.data;

    const targetStatus = drop.id.replace('column-', '');

    if (!this.isActive(opportunity)) {
      return false;
    }

    return targetStatus !== 'won' && targetStatus !== 'lost';
  }

  private isActive(opportunity: Opportunity): boolean {
    return !this.isArchivedStatus(opportunity.status);
  }

  private isArchivedStatus(status: OpportunityStatus): boolean {
    return status === OPPORTUNITY_STATUSES.WON.value || status === OPPORTUNITY_STATUSES.LOST.value;
  }

  /*
    Determine whether the next action
    requires immediate attention.
  */
  private isTodo(opportunity: Opportunity): boolean {
    return this.isDueWithin(opportunity, Number.MIN_SAFE_INTEGER, 0);
  }

  /*
    Determine whether the opportunity
    requires preparation this week.
  */
  private isPreparation(opportunity: Opportunity): boolean {
    if (!this.isDueWithin(opportunity, 1, 7)) {
      return false;
    }

    return this.preparationStatuses.includes(opportunity.status);
  }

  /*
    Determine whether the next action
    is due within the provided range.
  */
  private isDueWithin(opportunity: Opportunity, minDays: number, maxDays: number): boolean {
    const nextAction = opportunity.nextAction;

    if (!nextAction) {
      return false;
    }

    const differenceInDays = getCalendarDayDifference(nextAction.dueDate);

    if (differenceInDays === null) {
      return false;
    }

    return differenceInDays >= minDays && differenceInDays <= maxDays;
  }

  /*
    Status changes triggered from the details
    panel reuse the centralized workflow logic.
  */
  onOpportunityStatusChange(status: OpportunityStatus): void {
    const selected = this.selectedOpportunity();

    if (!selected) {
      return;
    }

    const isClosing =
      status === OPPORTUNITY_STATUSES.WON.value || status === OPPORTUNITY_STATUSES.LOST.value;

    const isReopening =
      (selected.status === OPPORTUNITY_STATUSES.WON.value ||
        selected.status === OPPORTUNITY_STATUSES.LOST.value) &&
      !isClosing;

    if (isClosing) {
      this.pendingStatus.set(status);

      this.detailsPanel()?.openStatusChange();

      return;
    }

    if (isReopening) {
      this.pendingStatus.set(status);

      this.detailsPanel()?.openMandatoryNextAction();

      return;
    }

    this.updateOpportunityStatus(selected.id, status);
  }

  private applyPendingStatus(): void {
    const selected = this.selectedOpportunity();

    const status = this.pendingStatus();

    if (!selected || !status) {
      return;
    }

    this.updateOpportunityStatus(selected.id, status);

    this.pendingStatus.set(null);
  }

  /*
    Centralize workflow status updates so all
    interactions share identical business behavior.
  */
  private updateOpportunityStatus(opportunityId: string, status: OpportunityStatus): void {
    this.opportunityApi.updateStatus(opportunityId, status).subscribe({
      next: (updated) => {
        this.replaceOpportunity(updated);
      },
    });
  }

  /*
    Notes are added centrally so the board
    remains the single source of truth.
  */
  onOpportunityNoteAdd(command: CreateNoteCommand): void {
    const opportunity = this.selectedOpportunity();

    if (!opportunity) {
      return;
    }

    this.noteApi.create(opportunity.id, command).subscribe((createdNote) => {
      const updatedOpportunity = {
        ...opportunity,
        notes: [createdNote, ...opportunity.notes],
      };

      this.replaceOpportunity(updatedOpportunity);
    });
  }

  /*
    Note updates stay centralized so all
    opportunity mutations share the same flow.
  */
  onOpportunityNoteUpdate(event: { noteId: string; title: string; content: string }): void {
    const opportunity = this.selectedOpportunity();

    if (!opportunity) {
      return;
    }

    this.noteApi.update(opportunity.id, event.noteId, event).subscribe((updatedNote) => {
      this.replaceOpportunity({
        ...opportunity,
        notes: opportunity.notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)),
      });
    });
  }

  /*
    Note deletions remain centralized to keep
    board state synchronized across the UI.
  */
  onOpportunityNoteDelete(noteId: string): void {
    const opportunity = this.selectedOpportunity();

    if (!opportunity) {
      return;
    }

    this.noteApi.delete(opportunity.id, noteId).subscribe(() => {
      this.replaceOpportunity({
        ...opportunity,
        notes: opportunity.notes.filter((note) => note.id !== noteId),
      });
    });
  }

  /*
    Timeline events are added centrally so
    opportunity history remains synchronized.
  */
  onOpportunityEventAdd(command: CreateOpportunityEventCommand): void {
    const opportunity = this.selectedOpportunity();

    if (!opportunity) {
      return;
    }

    this.opportunityEventApi.create(opportunity.id, command).subscribe((createdEvent) => {
      const updatedOpportunity = {
        ...opportunity,
        events: [createdEvent, ...opportunity.events],
      };

      this.replaceOpportunity(updatedOpportunity);
    });
  }

  onOpportunityEventUpdate(
    command: UpdateOpportunityEventCommand & {
      eventId: string;
    },
  ): void {
    const opportunity = this.selectedOpportunity();

    if (!opportunity) {
      return;
    }

    this.opportunityEventApi
      .update(opportunity.id, command.eventId, command)
      .subscribe((updatedEvent) => {
        const updatedOpportunity = {
          ...opportunity,
          events: opportunity.events.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event,
          ),
        };

        this.replaceOpportunity(updatedOpportunity);
      });
  }

  onOpportunityEventDelete(eventId: string): void {
    const opportunity = this.selectedOpportunity();

    if (!opportunity) {
      return;
    }

    this.opportunityEventApi.delete(opportunity.id, eventId).subscribe(() => {
      const updatedOpportunity = {
        ...opportunity,
        events: opportunity.events.filter((event) => event.id !== eventId),
      };

      this.replaceOpportunity(updatedOpportunity);
    });
  }

  completeNextAction(): void {
    const opportunity = this.selectedOpportunity();

    if (!opportunity?.nextAction) {
      return;
    }

    this.nextActionApi.complete(opportunity.id).subscribe(() => {
      this.replaceOpportunity({
        ...opportunity,
        nextAction: null,
      });
    });
  }

  onNextActionUpdate(command: CreateNextActionCommand): void {
    const opportunity = this.selectedOpportunity();

    if (!opportunity) {
      return;
    }

    const request$ = opportunity.nextAction
      ? this.nextActionApi.update(opportunity.id, command)
      : this.nextActionApi.create(opportunity.id, command);

    request$.subscribe((updatedNextAction) => {
      this.replaceOpportunity({
        ...opportunity,
        nextAction: updatedNextAction,
      });

      if (this.pendingStatus()) {
        this.applyPendingStatus();
      }
    });
  }

  onNextActionCompleteForStatusChange(): void {
    const opportunity = this.selectedOpportunity();

    if (!opportunity?.nextAction) {
      return;
    }

    this.nextActionApi.complete(opportunity.id).subscribe(() => {
      this.replaceOpportunity({
        ...opportunity,
        nextAction: null,
      });

      this.applyPendingStatus();
    });
  }

  onNextActionDeleteForStatusChange(): void {
    const opportunity = this.selectedOpportunity();

    if (!opportunity?.nextAction) {
      return;
    }

    this.nextActionApi.delete(opportunity.id).subscribe(() => {
      this.replaceOpportunity({
        ...opportunity,
        nextAction: null,
      });

      this.applyPendingStatus();
    });
  }

  onStatusChangeCancelled(): void {
    this.pendingStatus.set(null);

    this.detailsPanel()?.closeNextAction();
  }

  openOpportunityForm(): void {
    this.editedOpportunity.set(null);

    this.showOpportunityForm.set(true);
  }

  openOpportunityEdition(opportunity: Opportunity): void {
    this.closeDetailsPanel();

    this.editedOpportunity.set(opportunity);

    this.showOpportunityForm.set(true);
  }

  closeOpportunityForm(): void {
    this.showOpportunityForm.set(false);

    this.editedOpportunity.set(null);
  }

  /*
    Add the newly created opportunity
    to the active pipeline.
  */
  createOpportunity(command: CreateOpportunityCommand): void {
    this.opportunityApi.create(command).subscribe({
      next: (createdOpportunity) => {
        if (!command.nextAction) {
          this.opportunities.update((opportunities) => [createdOpportunity, ...opportunities]);

          this.closeOpportunityForm();

          return;
        }

        this.nextActionApi
          .create(createdOpportunity.id, command.nextAction)
          .subscribe((nextAction) => {
            this.opportunities.update((opportunities) => [
              {
                ...createdOpportunity,
                nextAction,
              },
              ...opportunities,
            ]);

            this.closeOpportunityForm();
          });
      },
    });
  }

  updateOpportunity(command: UpdateOpportunityCommand): void {
    this.opportunityApi.update(command.id, command).subscribe({
      next: (updated) => {
        this.replaceOpportunity(updated);
        this.closeOpportunityForm();
      },
    });
  }

  deleteOpportunity(): void {
    const selectedOpportunity = this.selectedOpportunity();

    if (!selectedOpportunity) {
      return;
    }

    this.opportunityApi.delete(selectedOpportunity.id).subscribe({
      next: () => {
        this.opportunities.update((opportunities) =>
          opportunities.filter((opportunity) => opportunity.id !== selectedOpportunity.id),
        );

        this.selectedOpportunity.set(null);
        this.pendingStatus.set(null);
      },
    });
  }

  /*
    Update the selected opportunity while
    keeping the board state synchronized.
  */
  private updateSelectedOpportunity(updater: (opportunity: Opportunity) => Opportunity): void {
    const selected = this.selectedOpportunity();

    if (!selected) {
      return;
    }

    const updatedOpportunity = updater(selected);

    this.opportunities.update((opportunities) =>
      opportunities.map((opportunity) =>
        opportunity.id === updatedOpportunity.id ? updatedOpportunity : opportunity,
      ),
    );

    this.selectedOpportunity.set(updatedOpportunity);
  }

  /*
    Match an opportunity against the current
    search query across its main metadata.
  */
  private matchesSearch(opportunity: Opportunity): boolean {
    const searchQuery = this.search().trim().toLowerCase();

    if (!searchQuery) {
      return true;
    }

    const searchableValues = [
      opportunity.companyName,
      opportunity.missionTitle,

      opportunity.contactName,
      opportunity.contactRole,
      opportunity.contactEmail,
      opportunity.contactPhone,

      opportunity.location,
      opportunity.source,
      opportunity.industry,
      opportunity.description,

      ...opportunity.stack,
    ];

    return searchableValues
      .filter((value): value is string => Boolean(value))
      .some((value) => value.toLowerCase().includes(searchQuery));
  }

  private matchesFilters(opportunity: Opportunity, includeNextActionDueFilter = true): boolean {
    const filters = this.filters();

    if (
      filters.modalities.length > 0 &&
      (!opportunity.modality || !filters.modalities.includes(opportunity.modality))
    ) {
      return false;
    }

    if (
      filters.seniorities.length > 0 &&
      (!opportunity.seniority || !filters.seniorities.includes(opportunity.seniority))
    ) {
      return false;
    }

    if (
      filters.companyTypes.length > 0 &&
      (!opportunity.companyType || !filters.companyTypes.includes(opportunity.companyType))
    ) {
      return false;
    }

    if (filters.sources.length > 0 && !filters.sources.includes(opportunity.source)) {
      return false;
    }

    if (filters.minimumDailyRate !== null && (opportunity.tjm ?? 0) < filters.minimumDailyRate) {
      return false;
    }

    if (includeNextActionDueFilter && !this.matchesNextActionDueFilter(opportunity)) {
      return false;
    }

    return true;
  }

  private matchesNextActionDueFilter(
    opportunity: Opportunity,
    selectedDays = this.filters().nextActionDueInDays,
  ): boolean {

    if (selectedDays.length === 0) {
      return true;
    }

    const dueInDays = getCalendarDayDifference(opportunity.nextAction?.dueDate);

    return selectedDays.some((selectedDay) =>
      selectedDay === '7-plus'
        ? dueInDays !== null && dueInDays > 7
        : dueInDays === selectedDay,
    );
  }

  /*
    Replace an existing opportunity while
    keeping the board state synchronized.
  */
  private replaceOpportunity(updated: Opportunity): void {
    this.opportunities.update((opportunities) =>
      opportunities.map((opportunity) => (opportunity.id === updated.id ? updated : opportunity)),
    );

    if (this.selectedOpportunity()?.id === updated.id) {
      this.selectedOpportunity.set(updated);
    }
  }
}

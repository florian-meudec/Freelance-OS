import { Component, computed, effect, signal, viewChild } from '@angular/core';
import { CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';

import { Opportunity } from '../../models/opportunity.model';
import { OpportunityCard } from '../../components/opportunity-card/opportunity-card';
import { OpportunityDetailsPanel } from '../../components/opportunity-details-panel/opportunity-details-panel';
import {
  OPPORTUNITY_EVENT_TYPES,
  OPPORTUNITY_QUICK_VIEWS,
  OPPORTUNITY_STATUSES,
  OpportunityQuickView,
} from '../../constants/opportunity.constants';

import { MOCK_OPPORTUNITIES } from '../../mocks/mock-opportunities';
import { OpportunityEventType, OpportunityStatus } from '../../types/opportunity.type';
import { NextAction } from '../../models/next-action.model';
import { OpportunityForm } from '../../components/opportunity-form/opportunity-form';
import { OpportunityQuickViews } from '../../components/opportunity-quick-views/opportunity-quick-views';
import { SearchInput } from '../../../../shared/components/search-input/search-input';

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
    OpportunityForm,
    OpportunityQuickViews,
    SearchInput,
  ],
  templateUrl: './opportunities-board.html',
  styleUrl: './opportunities-board.scss',
})
export class OpportunitiesBoard {
  /*
    Opportunities are stored in a signal
    so the board can react to drag & drop updates.
  */
  readonly opportunities = signal([...MOCK_OPPORTUNITIES]);

  /*
    Statuses are sorted once to keep the kanban
    pipeline order centralized in the constants layer.
  */
  readonly statuses = Object.values(OPPORTUNITY_STATUSES).sort((a, b) => a.order - b.order);

  /*
    Build kanban columns dynamically from statuses
    so the board structure stays configuration-driven.
  */
  readonly columns = computed(() => {
    return this.statuses.map((status) => {
      const totalOpportunities = this.opportunities().filter(
        (opportunity) => opportunity.status === status.value,
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
      (column) =>
        column.status !== OPPORTUNITY_STATUSES.WON.value &&
        column.status !== OPPORTUNITY_STATUSES.LOST.value,
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

  /*
    Visible opportunities depend on
    the selected quick view.
  */
  readonly visibleOpportunities = computed(() => {
    let opportunities = this.opportunities();

    switch (this.selectedQuickView()) {
      case OPPORTUNITY_QUICK_VIEWS.TODO.value:
        opportunities = opportunities.filter((opportunity) => this.isTodo(opportunity));
        break;

      case OPPORTUNITY_QUICK_VIEWS.PREPARE.value:
        opportunities = opportunities.filter((opportunity) => this.isPreparation(opportunity));
        break;
    }

    return opportunities.filter((opportunity) => this.matchesSearch(opportunity));
  });

  private readonly preparationStatuses: OpportunityStatus[] = [
    OPPORTUNITY_STATUSES.INTERVIEW.value,
    OPPORTUNITY_STATUSES.PROPOSAL.value,
    OPPORTUNITY_STATUSES.NEGOTIATION.value,
  ];

  readonly todoCount = computed(
    () => this.opportunities().filter((opportunity) => this.isTodo(opportunity)).length,
  );

  readonly preparationCount = computed(
    () => this.opportunities().filter((opportunity) => this.isPreparation(opportunity)).length,
  );

  readonly totalCount = computed(() => this.opportunities().length);

  constructor() {
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

  selectOpportunity(opportunity: Opportunity): void {
    this.selectedOpportunity.set(opportunity);
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

    const isArchived =
      opportunity.status === OPPORTUNITY_STATUSES.WON.value ||
      opportunity.status === OPPORTUNITY_STATUSES.LOST.value;

    if (isArchived) {
      return false;
    }

    return targetStatus !== 'won' && targetStatus !== 'lost';
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

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(nextAction.dueDate);

    dueDate.setHours(0, 0, 0, 0);

    const differenceInDays = Math.floor(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

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
    this.opportunities.update((opportunities) =>
      opportunities.map((opportunity) => {
        if (opportunity.id !== opportunityId) {
          return opportunity;
        }

        return {
          ...opportunity,

          status,

          events: [
            ...opportunity.events,

            {
              id: crypto.randomUUID(),

              type: OPPORTUNITY_EVENT_TYPES.STATUS_CHANGED.value,

              status,

              createdAt: new Date().toISOString(),
            },
          ],
        };
      }),
    );

    /*
      Keep the details panel synchronized
      with the updated workflow state.
    */
    const updatedOpportunity = this.opportunities().find(
      (opportunity) => opportunity.id === opportunityId,
    );

    if (!updatedOpportunity) {
      return;
    }

    if (this.selectedOpportunity()?.id === updatedOpportunity.id) {
      this.selectedOpportunity.set(updatedOpportunity);
    }
  }

  /*
    Notes are added centrally so the board
    remains the single source of truth.
  */
  onOpportunityNoteAdd(note: { title: string; content: string }): void {
    this.updateSelectedOpportunity((opportunity) => ({
      ...opportunity,

      notes: [
        ...opportunity.notes,

        {
          id: crypto.randomUUID(),
          title: note.title,
          content: note.content,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  }

  /*
    Note updates stay centralized so all
    opportunity mutations share the same flow.
  */
  onOpportunityNoteUpdate(note: { noteId: string; title: string; content: string }): void {
    this.updateSelectedOpportunity((opportunity) => ({
      ...opportunity,

      notes: opportunity.notes.map((currentNote) =>
        currentNote.id === note.noteId
          ? {
              ...currentNote,
              title: note.title,
              content: note.content,
            }
          : currentNote,
      ),
    }));
  }

  /*
    Note deletions remain centralized to keep
    board state synchronized across the UI.
  */
  onOpportunityNoteDelete(noteId: string): void {
    this.updateSelectedOpportunity((opportunity) => ({
      ...opportunity,

      notes: opportunity.notes.filter((note) => note.id !== noteId),
    }));
  }

  /*
    Timeline events are added centrally so
    opportunity history remains synchronized.
  */
  onOpportunityEventAdd(event: { type: OpportunityEventType; comment?: string }): void {
    this.updateSelectedOpportunity((opportunity) => ({
      ...opportunity,

      events: [
        ...opportunity.events,

        {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          type: event.type,
          comment: event.comment,
        },
      ],
    }));
  }

  onOpportunityEventUpdate(event: {
    eventId: string;
    type: OpportunityEventType;
    comment?: string;
  }): void {
    this.updateSelectedOpportunity((opportunity) => ({
      ...opportunity,

      events: opportunity.events.map((currentEvent) =>
        currentEvent.id === event.eventId
          ? {
              ...currentEvent,
              type: event.type,
              comment: event.comment,
            }
          : currentEvent,
      ),
    }));
  }

  onOpportunityEventDelete(eventId: string): void {
    this.updateSelectedOpportunity((opportunity) => ({
      ...opportunity,

      events: opportunity.events.filter((event) => event.id !== eventId),
    }));
  }

  completeNextAction(): void {
    if (!this.selectedOpportunity()?.nextAction) {
      return;
    }

    this.updateSelectedOpportunity((opportunity) => ({
      ...opportunity,

      nextAction: null,
    }));
  }

  onNextActionUpdate(nextAction: NextAction): void {
    this.updateSelectedOpportunity((opportunity) => ({
      ...opportunity,

      nextAction,
    }));

    if (this.pendingStatus()) {
      this.applyPendingStatus();
    }
  }

  onNextActionCompleteForStatusChange(): void {
    this.completeNextAction();

    this.applyPendingStatus();
  }

  onNextActionDeleteForStatusChange(): void {
    this.removeNextAction();

    this.applyPendingStatus();
  }

  onStatusChangeCancelled(): void {
    this.pendingStatus.set(null);

    this.detailsPanel()?.closeNextAction();
  }

  /*
    Remove the current next action
    from the selected opportunity.
  */
  private removeNextAction(): void {
    this.updateSelectedOpportunity((opportunity) => ({
      ...opportunity,

      nextAction: null,
    }));
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
  createOpportunity(opportunity: Opportunity): void {
    this.opportunities.update((opportunities) => [opportunity, ...opportunities]);

    this.closeOpportunityForm();
  }

  updateOpportunity(updated: Opportunity): void {
    this.replaceOpportunity(updated);

    this.closeOpportunityForm();
  }

  deleteOpportunity(): void {
    const selectedOpportunity = this.selectedOpportunity();

    if (!selectedOpportunity) {
      return;
    }

    this.opportunities.update((opportunities) =>
      opportunities.filter((opportunity) => opportunity.id !== selectedOpportunity.id),
    );

    this.closeOpportunityForm();

    this.closeDetailsPanel();
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
    const search = this.search().trim().toLowerCase();

    if (!search) {
      return true;
    }

    const searchableValues = [
      opportunity.companyName,
      opportunity.missionTitle,

      opportunity.contactName,
      opportunity.contactRole,
      opportunity.contactEmail,

      opportunity.location,
      opportunity.source,
      opportunity.industry,
      opportunity.description,

      ...opportunity.stack,
    ];

    return searchableValues
      .filter((value): value is string => Boolean(value))
      .some((value) => value.toLowerCase().includes(search));
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

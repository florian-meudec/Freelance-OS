import { Component, computed, effect, signal, viewChild } from '@angular/core';
import { CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';

import { Opportunity, OpportunityStatus } from '../../models/opportunity.model';
import { OpportunityCard } from '../../components/opportunity-card/opportunity-card';
import { OpportunityDetailsPanel } from '../../components/opportunity-details-panel/opportunity-details-panel';
import {
  OPPORTUNITY_EVENT_TYPES,
  OPPORTUNITY_STATUSES,
} from '../../constants/opportunity.constants';

import { MOCK_OPPORTUNITIES } from '../../mocks/mock-opportunities';
import { OpportunityEventType } from '../../models/opportunity-event.model';
import { NextAction } from '../../models/next-action.model';

/*
  Columns act as drop zones for kanban interactions.
*/
@Component({
  selector: 'app-opportunities-board',
  standalone: true,
  imports: [CdkDropList, CdkDropListGroup, OpportunityCard, OpportunityDetailsPanel],
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
    return this.statuses.map((status) => ({
      status: status.value,
      label: status.label,
      opportunities: this.opportunities().filter(
        (opportunity) => opportunity.status === status.value,
      ),
    }));
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

  readonly detailsPanel = viewChild<OpportunityDetailsPanel>('detailsPanel');

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
    Status changes triggered from the details
    panel reuse the centralized workflow logic.
  */
  onOpportunityStatusChange(status: OpportunityStatus): void {
    const selected = this.selectedOpportunity();

    if (!selected) {
      return;
    }

    this.updateOpportunityStatus(selected.id, status);
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
    const selected = this.selectedOpportunity();

    if (!selected) {
      return;
    }

    const updatedOpportunity = {
      ...selected,

      notes: [
        ...selected.notes,

        {
          id: crypto.randomUUID(),

          title: note.title,

          content: note.content,

          createdAt: new Date().toISOString(),
        },
      ],
    };

    this.opportunities.update((opportunities) =>
      opportunities.map((opportunity) =>
        opportunity.id === updatedOpportunity.id ? updatedOpportunity : opportunity,
      ),
    );

    this.selectedOpportunity.set(updatedOpportunity);
  }

  /*
    Note updates stay centralized so all
    opportunity mutations share the same flow.
  */
  onOpportunityNoteUpdate(note: { noteId: string; title: string; content: string }): void {
    const selected = this.selectedOpportunity();

    if (!selected) {
      return;
    }

    const updatedOpportunity = {
      ...selected,

      notes: selected.notes.map((item) =>
        item.id === note.noteId
          ? {
              ...item,

              title: note.title,

              content: note.content,
            }
          : item,
      ),
    };

    this.opportunities.update((opportunities) =>
      opportunities.map((opportunity) =>
        opportunity.id === updatedOpportunity.id ? updatedOpportunity : opportunity,
      ),
    );

    this.selectedOpportunity.set(updatedOpportunity);
  }

  /*
    Note deletions remain centralized to keep
    board state synchronized across the UI.
  */
  onOpportunityNoteDelete(noteId: string): void {
    const selected = this.selectedOpportunity();

    if (!selected) {
      return;
    }

    const updatedOpportunity = {
      ...selected,

      notes: selected.notes.filter((note) => note.id !== noteId),
    };

    this.opportunities.update((opportunities) =>
      opportunities.map((opportunity) =>
        opportunity.id === updatedOpportunity.id ? updatedOpportunity : opportunity,
      ),
    );

    this.selectedOpportunity.set(updatedOpportunity);
  }

  /*
    Timeline events are added centrally so
    opportunity history remains synchronized.
  */
  onOpportunityEventAdd(event: { type: OpportunityEventType; comment?: string }): void {
    const selected = this.selectedOpportunity();

    if (!selected) {
      return;
    }

    const updatedOpportunity = {
      ...selected,

      events: [
        ...selected.events,

        {
          id: crypto.randomUUID(),

          type: event.type,

          comment: event.comment,

          createdAt: new Date().toISOString(),
        },
      ],
    };

    this.opportunities.update((opportunities) =>
      opportunities.map((opportunity) =>
        opportunity.id === updatedOpportunity.id ? updatedOpportunity : opportunity,
      ),
    );

    this.selectedOpportunity.set(updatedOpportunity);
  }

  onOpportunityEventUpdate(event: {
    eventId: string;
    type: OpportunityEventType;
    comment?: string;
  }): void {
    const selected = this.selectedOpportunity();

    if (!selected) {
      return;
    }

    const updatedOpportunity = {
      ...selected,

      events: selected.events.map((item) =>
        item.id === event.eventId
          ? {
              ...item,

              type: event.type,

              comment: event.comment,
            }
          : item,
      ),
    };

    this.opportunities.update((opportunities) =>
      opportunities.map((opportunity) =>
        opportunity.id === updatedOpportunity.id ? updatedOpportunity : opportunity,
      ),
    );

    this.selectedOpportunity.set(updatedOpportunity);
  }

  onOpportunityEventDelete(eventId: string): void {
    const selected = this.selectedOpportunity();

    if (!selected) {
      return;
    }

    const updatedOpportunity = {
      ...selected,

      events: selected.events.filter((event) => event.id !== eventId),
    };

    this.opportunities.update((opportunities) =>
      opportunities.map((opportunity) =>
        opportunity.id === updatedOpportunity.id ? updatedOpportunity : opportunity,
      ),
    );

    this.selectedOpportunity.set(updatedOpportunity);
  }

  completeNextAction(): void {
    const selected = this.selectedOpportunity();

    if (!selected?.nextAction) {
      return;
    }

    const updatedOpportunity = {
      ...selected,

      events: [
        ...selected.events,

        {
          id: crypto.randomUUID(),

          type: selected.nextAction.type,

          comment: selected.nextAction.label,

          createdAt: new Date().toISOString(),
        },
      ],
    };

    this.opportunities.update((opportunities) =>
      opportunities.map((opportunity) =>
        opportunity.id === updatedOpportunity.id ? updatedOpportunity : opportunity,
      ),
    );

    this.selectedOpportunity.set(updatedOpportunity);
  }

  onNextActionUpdate(nextAction: NextAction): void {
    const selected = this.selectedOpportunity();

    if (!selected) {
      return;
    }

    const updatedOpportunity = {
      ...selected,

      nextAction,
    };

    this.opportunities.update((opportunities) =>
      opportunities.map((opportunity) =>
        opportunity.id === updatedOpportunity.id ? updatedOpportunity : opportunity,
      ),
    );

    this.selectedOpportunity.set(updatedOpportunity);
  }
}

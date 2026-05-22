import { Component, computed, effect, signal } from '@angular/core';
import { CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';

import { Opportunity, OpportunityStatus } from '../../models/opportunity.model';
import { OpportunityCard } from '../../components/opportunity-card/opportunity-card';
import { OpportunityDetailsPanel } from '../../components/opportunity-details-panel/opportunity-details-panel';
import { OPPORTUNITY_STATUSES } from '../../constants/opportunity.constants';

import { MOCK_OPPORTUNITIES } from '../../mocks/mock-opportunities';

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
    this.selectedOpportunity.set(null);
  }

  /*
    Moving a card between columns updates
    the underlying opportunity status.
  */
  moveOpportunity(event: CdkDragDrop<Opportunity[]>, status: OpportunityStatus): void {
    const opportunity = event.item.data as Opportunity;

    if (opportunity.status === status) {
      return;
    }

    this.opportunities.update((opportunities) =>
      opportunities.map((item) =>
        item.id === opportunity.id
          ? {
              ...item,
              status,
            }
          : item,
      ),
    );
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
}

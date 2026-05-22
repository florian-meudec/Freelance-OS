import { Component, computed, effect, signal } from '@angular/core';

import { Opportunity } from '../../models/opportunity.model';
import { OpportunityCard } from '../../components/opportunity-card/opportunity-card';
import { OpportunityDetailsPanel } from '../../components/opportunity-details-panel/opportunity-details-panel';
import { OPPORTUNITY_STATUSES } from '../../constants/opportunity.constants';

import { MOCK_OPPORTUNITIES } from '../../mocks/mock-opportunities';

@Component({
  selector: 'app-opportunities-board',
  standalone: true,
  imports: [OpportunityCard, OpportunityDetailsPanel],
  templateUrl: './opportunities-board.html',
  styleUrl: './opportunities-board.scss',
})
export class OpportunitiesBoard {
  readonly opportunities = MOCK_OPPORTUNITIES;

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
      opportunities: this.opportunities.filter(
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

  readonly showArchived = signal(false);

  /*
    Archived sections stay separated to help analyze
    wins and losses independently.
  */
  readonly lostOpportunities = computed(() => {
    return this.opportunities.filter(
      (opportunity) => opportunity.status === OPPORTUNITY_STATUSES.LOST.value,
    );
  });

  readonly wonOpportunities = computed(() => {
    return this.opportunities.filter(
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

  toggleArchived(): void {
    this.showArchived.update((value) => !value);
  }

  selectOpportunity(opportunity: Opportunity): void {
    this.selectedOpportunity.set(opportunity);
  }

  closeDetailsPanel(): void {
    this.selectedOpportunity.set(null);
  }
}

import { Component, computed, signal } from '@angular/core';

import { OpportunityCard } from '../../components/opportunity-card/opportunity-card';
import { OPPORTUNITY_STATUSES } from '../../constants/opportunity.constants';

import { MOCK_OPPORTUNITIES } from '../../mocks/mock-opportunities';

@Component({
  selector: 'app-opportunities-board',
  standalone: true,
  imports: [OpportunityCard],
  templateUrl: './opportunities-board.html',
  styleUrl: './opportunities-board.scss',
})
export class OpportunitiesBoard {
  readonly opportunities = MOCK_OPPORTUNITIES;

  readonly statuses = Object.values(OPPORTUNITY_STATUSES).sort((a, b) => a.order - b.order);

  readonly columns = computed(() => {
    return this.statuses.map((status) => ({
      status: status.value,
      label: status.label,

      opportunities: this.opportunities.filter(
        (opportunity) => opportunity.status === status.value,
      ),
    }));
  });

  readonly activeColumns = computed(() => {
    return this.columns().filter(
      (column) =>
        column.status !== OPPORTUNITY_STATUSES.WON.value &&
        column.status !== OPPORTUNITY_STATUSES.LOST.value,
    );
  });

  readonly showArchived = signal(false);

  toggleArchived(): void {
    this.showArchived.update((value) => !value);
  }

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
}

import { Component } from '@angular/core';

import { OpportunityCard } from '../../components/opportunity-card/opportunity-card';

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
}

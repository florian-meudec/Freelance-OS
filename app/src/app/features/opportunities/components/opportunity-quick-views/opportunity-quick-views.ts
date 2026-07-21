import { Component, input, output } from '@angular/core';

import {
  OPPORTUNITY_QUICK_VIEWS,
  OpportunityQuickView,
} from '../../constants/opportunity.constants';

@Component({
  selector: 'app-opportunity-quick-views',
  standalone: true,
  imports: [],
  templateUrl: './opportunity-quick-views.html',
  styleUrl: './opportunity-quick-views.scss',
})
export class OpportunityQuickViews {
  readonly selected = input.required<OpportunityQuickView>();

  /*
    Opportunity counts are computed by the
    board and displayed inside quick views.
  */
  readonly todoCount = input.required<number>();

  readonly preparationCount = input.required<number>();

  readonly totalCount = input.required<number>();

  readonly selectedChange = output<OpportunityQuickView>();

  /*
    Available quick views remain centralized
    through shared business constants.
  */
  readonly quickViews = Object.values(OPPORTUNITY_QUICK_VIEWS);

  /*
    Notify the parent component whenever
    the selected quick view changes.
  */
  select(view: OpportunityQuickView): void {
    this.selectedChange.emit(view);
  }
}

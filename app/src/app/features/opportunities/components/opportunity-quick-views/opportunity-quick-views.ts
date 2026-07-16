import { Component, input, output } from '@angular/core';
import {
  OPPORTUNITY_QUICK_VIEWS,
  OpportunityQuickView,
} from '../../constants/opportunity.constants';

@Component({
  selector: 'app-opportunity-quick-views',
  imports: [],
  standalone: true,
  templateUrl: './opportunity-quick-views.html',
  styleUrl: './opportunity-quick-views.scss',
})
export class OpportunityQuickViews {
  readonly selected = input.required<OpportunityQuickView>();

  readonly todoCount = input.required<number>();

  readonly preparationCount = input.required<number>();

  readonly totalCount = input.required<number>();

  readonly selectedChange = output<OpportunityQuickView>();

  readonly quickViews = Object.values(OPPORTUNITY_QUICK_VIEWS);

  select(view: OpportunityQuickView): void {
    this.selectedChange.emit(view);
  }
}

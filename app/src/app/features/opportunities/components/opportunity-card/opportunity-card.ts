import { Component, computed, input, output } from '@angular/core';
import { Opportunity } from '../../models/opportunity.model';

import { DateFormatPipe } from '../../../../shared/pipes/date-format-pipe';
import { TjmPipe } from '../../../../shared/pipes/tjm-pipe';
import { WorkloadPipe } from '../../../../shared/pipes/workload-pipe';
import {
  OPPORTUNITY_MODALITIES,
  OPPORTUNITY_URGENCIES,
} from '../../constants/opportunity.constants';
import { calculateOpportunityUrgency } from '../../utils/opportunity-urgency.util';

@Component({
  selector: 'app-opportunity-card',
  standalone: true,
  imports: [DateFormatPipe, TjmPipe, WorkloadPipe],
  templateUrl: './opportunity-card.html',
  styleUrl: './opportunity-card.scss',
})
export class OpportunityCard {
  readonly opportunity = input.required<Opportunity>();

  readonly modalities = OPPORTUNITY_MODALITIES;

  readonly urgencies = OPPORTUNITY_URGENCIES;

  readonly urgency = computed(() => calculateOpportunityUrgency(this.opportunity().nextActionDate));

  readonly headerClass = computed(() => `urgency-${this.urgency()}`);

  readonly modalityLabel = computed(() => {
    const modality = this.opportunity().modality;

    return Object.values(this.modalities).find((item) => item.value === modality)?.label;
  });

  readonly cardClick = output<Opportunity>();

  onCardClick(): void {
    this.cardClick.emit(this.opportunity());
  }
}

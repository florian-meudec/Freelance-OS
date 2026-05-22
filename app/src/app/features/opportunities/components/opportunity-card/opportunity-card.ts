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

  /*
    Allows the board container to visually highlight
    the currently opened opportunity.
  */
  readonly selected = input(false);

  readonly modalities = OPPORTUNITY_MODALITIES;

  readonly urgencies = OPPORTUNITY_URGENCIES;

  /*
    Urgency is derived from the next follow-up date
    to keep visual prioritization centralized.
  */
  readonly urgency = computed(() => calculateOpportunityUrgency(this.opportunity().nextActionDate));

  /*
    Maps urgency values to CSS modifier classes
    used by the colored card header.
  */
  readonly headerClass = computed(() => `urgency-${this.urgency()}`);

  /*
    Converts modality values into user-facing labels
    to keep display logic independent from raw data.
  */
  readonly modalityLabel = computed(() => {
    const modality = this.opportunity().modality;

    return Object.values(this.modalities).find((item) => item.value === modality)?.label;
  });

  /*
    The board container handles selection state
    and panel opening logic.
  */
  readonly cardClick = output<Opportunity>();

  onCardClick(): void {
    this.cardClick.emit(this.opportunity());
  }
}

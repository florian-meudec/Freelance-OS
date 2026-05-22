import { Component, computed, input, output, signal } from '@angular/core';
import { Opportunity } from '../../models/opportunity.model';

import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';

import { DateFormatPipe } from '../../../../shared/pipes/date-format-pipe';
import { TjmPipe } from '../../../../shared/pipes/tjm-pipe';
import { WorkloadPipe } from '../../../../shared/pipes/workload-pipe';
import { OPPORTUNITY_MODALITIES } from '../../constants/opportunity.constants';
import { calculateOpportunityUrgency } from '../../utils/opportunity-urgency.util';

/*
  Cards are draggable to support kanban-style
  opportunity workflow management.
*/
@Component({
  selector: 'app-opportunity-card',
  standalone: true,
  imports: [CdkDrag, CdkDragHandle, DateFormatPipe, TjmPipe, WorkloadPipe],
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

  /*
    Archived opportunities disable drag interactions
    to preserve historical pipeline integrity.
  */
  readonly draggable = input(true);
  /*
    Prevent accidental panel openings
    while dragging cards.
  */
  readonly isDragging = signal(false);

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

    return Object.values(OPPORTUNITY_MODALITIES).find((item) => item.value === modality)?.label;
  });

  /*
    The board container handles selection state
    and panel opening logic.
  */
  readonly cardClick = output<Opportunity>();

  onCardClick(): void {
    if (this.isDragging()) {
      return;
    }

    this.cardClick.emit(this.opportunity());
  }

  onDragStarted(): void {
    this.isDragging.set(true);
  }

  onDragEnded(): void {
    /*
    Delay drag cleanup slightly to prevent
    click events firing immediately after drops.
  */
    setTimeout(() => {
      this.isDragging.set(false);
    });
  }
}

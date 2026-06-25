import { Component, computed, input, output, signal } from '@angular/core';
import { OpportunityEventType } from '../../models/opportunity-event.model';
import { OPPORTUNITY_EVENT_TYPES } from '../../constants/opportunity.constants';
import { DateFormatPipe } from '../../../../shared/pipes/date-format-pipe';
import { NextAction } from '../../models/next-action.model';

@Component({
  selector: 'app-next-action-card',
  standalone: true,
  imports: [DateFormatPipe],
  templateUrl: './next-action-card.html',
  styleUrl: './next-action-card.scss',
})
export class NextActionCard {
  readonly nextAction = input<NextAction | null>();

  readonly update = output<NextAction>();
  readonly complete = output<void>();

  /*
    Only user-generated event types are exposed
    through the manual timeline workflow.
  */
  readonly manualEventTypes = [
    OPPORTUNITY_EVENT_TYPES.CALL,
    OPPORTUNITY_EVENT_TYPES.EMAIL,
    OPPORTUNITY_EVENT_TYPES.MEETING,
  ];

  readonly currentNextActionTypeLabel = computed(
    () =>
      this.manualEventTypes.find((eventType) => eventType.value === this.currentNextActionType())
        ?.label ?? '',
  );

  readonly currentNextActionType = signal<OpportunityEventType>(this.manualEventTypes[0].value);
  readonly showNextActionTypeSelector = signal(false);
  readonly nextActionMode = signal<NextActionMode>('view');

  /*
    The next action card supports several
    workflow modes while sharing the same UI.
  */
  open(): void {
    if (this.nextAction()) {
      this.setMode('edit');
    } else {
      this.setMode('create');
    }
  }

  private setMode(mode: NextActionMode): void {
    this.showNextActionTypeSelector.set(false);

    this.nextActionMode.set(mode);

    const nextAction = this.nextAction();

    if (mode === 'edit' && nextAction) {
      this.currentNextActionType.set(nextAction.type);
    } else {
      this.currentNextActionType.set(this.manualEventTypes[0].value);
    }
  }

  close(): void {
    this.nextActionMode.set('view');
    this.showNextActionTypeSelector.set(false);
  }

  selectNextActionType(type: OpportunityEventType): void {
    this.currentNextActionType.set(type);

    this.showNextActionTypeSelector.set(false);
  }

  toggleNextActionTypeMenu(): void {
    this.showNextActionTypeSelector.update((value) => !value);
  }

  save(label: string, dueDate: string): void {
    this.update.emit({
      type: this.currentNextActionType(),
      label,
      dueDate,
    });

    this.close();
  }

  /*
    Completing an action immediately prepares
    the workflow for defining the next one.
  */
  completeAction(): void {
    this.complete.emit();

    this.setMode('create');
  }
}

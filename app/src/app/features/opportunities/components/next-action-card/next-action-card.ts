import {
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SelectMenu } from '../../../../shared/components/select-menu/select-menu';
import { DateFormatPipe } from '../../../../shared/pipes/date-format-pipe';

import {
  OPPORTUNITY_EVENT_TYPES,
  OPPORTUNITY_STATUSES,
} from '../../constants/opportunity.constants';

import { NextAction } from '../../models/next-action.model';

import { OpportunityEventType, OpportunityStatus } from '../../types/opportunity.type';
import { FormInteractionHandler } from '../../../../shared/utils/form-interaction-handler';
import { DiscardChangesModal } from '../../../../shared/components/discard-changes-modal/discard-changes-modal';

@Component({
  selector: 'app-next-action-card',

  standalone: true,

  imports: [DateFormatPipe, ReactiveFormsModule, SelectMenu, DiscardChangesModal],

  templateUrl: './next-action-card.html',

  styleUrl: './next-action-card.scss',
})
export class NextActionCard extends FormInteractionHandler {
  readonly nextAction = input<NextAction | null>(null);

  readonly pendingStatus = input<OpportunityStatus | null>();

  readonly update = output<NextAction>();

  readonly complete = output<void>();

  readonly completeForStatusChange = output<void>();

  readonly deleteForStatusChange = output<void>();

  readonly statusChangeCancelled = output<void>();

  readonly container = viewChild<ElementRef>('container');

  readonly nextActionLabel = viewChild<ElementRef<HTMLInputElement>>('nextActionLabel');

  /*
    Only user-generated event types are exposed
    through the manual timeline workflow.
  */
  readonly manualEventTypes = [
    OPPORTUNITY_EVENT_TYPES.CALL,
    OPPORTUNITY_EVENT_TYPES.EMAIL,
    OPPORTUNITY_EVENT_TYPES.MEETING,
  ];

  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly form = this.formBuilder.group({
    type: this.formBuilder.control<OpportunityEventType>(
      this.manualEventTypes[0].value,
      Validators.required,
    ),

    label: ['', Validators.required],

    dueDate: ['', Validators.required],
  });

  readonly nextActionMode = signal<NextActionMode>('view');

  readonly pendingStatusLabel = computed(() => {
    switch (this.pendingStatus()) {
      case OPPORTUNITY_STATUSES.WON.value:
        return OPPORTUNITY_STATUSES.WON.label;

      case OPPORTUNITY_STATUSES.LOST.value:
        return OPPORTUNITY_STATUSES.LOST.label;

      default:
        return '';
    }
  });

  /*
    Open creation or edition depending
    on the current workflow state.
  */
  open(): void {
    if (this.nextAction()) {
      this.openEditionForm();

      return;
    }

    this.openCreationForm();
  }

  /*
    Open the mandatory follow-up workflow
    after completing the current action.
  */
  openMandatory(): void {
    this.scrollIntoView();

    this.resetForm();

    this.nextActionMode.set('mandatory');

    this.focusForm();
  }

  /*
    Open the status change workflow
    requiring a decision on the action.
  */
  openStatusChange(): void {
    this.scrollIntoView();

    this.resetForm();

    this.nextActionMode.set('status-change');
  }

  /*
    Request workflow closure while
    protecting unsaved modifications.
  */
  requestClose(): void {
    if (this.isBlocking()) {
      return;
    }

    this.executeOrConfirm(this.form.dirty, () => this.close());
  }

  /*
    Emit next action updates upward so the
    parent remains the source of truth.
  */
  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.update.emit({
      type: this.form.controls.type.value,
      label: this.form.controls.label.value.trim(),
      dueDate: this.form.controls.dueDate.value,
    });

    this.close();
  }

  /*
    Complete the current action before
    requesting the mandatory follow-up.
  */
  completeAction(): void {
    this.complete.emit();

    this.openMandatory();
  }

  /*
    Complete the current action before
    applying the pending status change.
  */
  completeForStatusChangeAction(): void {
    this.close();

    this.completeForStatusChange.emit();
  }

  /*
    Remove the current action before
    applying the pending status change.
  */
  deleteForStatusChangeAction(): void {
    this.close();

    this.deleteForStatusChange.emit();
  }

  /*
    Cancel the pending status change
    and restore the previous workflow.
  */
  cancelStatusChange(): void {
    this.close();

    this.statusChangeCancelled.emit();
  }

  /*
    Mandatory workflows cannot be
    dismissed until completed.
  */
  isBlocking(): boolean {
    return this.nextActionMode() === 'mandatory' || this.nextActionMode() === 'status-change';
  }

  /*
    Populate the form from the current
    next action or reset to defaults.
  */
  private fillForm(nextAction: NextAction | null | undefined): void {
    this.form.reset({
      type: nextAction?.type ?? this.manualEventTypes[0].value,
      label: nextAction?.label ?? '',
      dueDate: nextAction?.dueDate ?? '',
    });
  }

  /*
    Restore the default form state.
  */
  private resetForm(): void {
    this.fillForm(null);
  }

  scrollIntoView(): void {
    this.container()?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  /*
    Focus the first editable field once
    the form has been rendered.
  */
  private focusForm(): void {
    queueMicrotask(() => {
      this.nextActionLabel()?.nativeElement.focus();
    });
  }

  /*
    Initialize the creation workflow
    and focus the first editable field.
  */
  private openCreationForm(): void {
    this.scrollIntoView();

    this.nextActionMode.set('create');

    this.resetForm();

    this.focusForm();
  }

  /*
    Initialize edition from the current
    next action and focus the first field.
  */
  private openEditionForm(): void {
    this.scrollIntoView();

    this.nextActionMode.set('edit');

    this.fillForm(this.nextAction());

    this.focusForm();
  }

  /*
    Close the current workflow and
    restore its initial state.
  */
  close(): void {
    this.resetForm();

    this.nextActionMode.set('view');
  }
}

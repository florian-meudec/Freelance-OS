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

  open(): void {
    if (this.nextAction()) {
      this.openEditionForm();

      return;
    }

    this.openCreationForm();
  }

  isBlocking(): boolean {
    return this.nextActionMode() === 'mandatory' || this.nextActionMode() === 'status-change';
  }

  private fillForm(nextAction: NextAction | null | undefined): void {
    this.form.reset({
      type: nextAction?.type ?? this.manualEventTypes[0].value,
      label: nextAction?.label ?? '',
      dueDate: nextAction?.dueDate ?? '',
    });
  }

  private resetForm(): void {
    this.fillForm(null);
  }

  scrollIntoView(): void {
    this.container()?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  close(): void {
    this.resetForm();

    this.nextActionMode.set('view');
  }

  selectNextActionType(type: string): void {
    this.form.controls.type.setValue(type as OpportunityEventType);
  }

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

  completeAction(): void {
    this.complete.emit();

    this.openMandatory();
  }

  completeForStatusChangeAction(): void {
    this.close();

    this.completeForStatusChange.emit();
  }

  deleteForStatusChangeAction(): void {
    this.close();

    this.deleteForStatusChange.emit();
  }

  cancelStatusChange(): void {
    this.close();

    this.statusChangeCancelled.emit();
  }

  private focusForm(): void {
    queueMicrotask(() => {
      this.nextActionLabel()?.nativeElement.focus();
    });
  }

  private openCreationForm(): void {
    this.scrollIntoView();

    this.nextActionMode.set('create');

    this.resetForm();

    this.focusForm();
  }

  private openEditionForm(): void {
    this.scrollIntoView();

    this.nextActionMode.set('edit');

    this.fillForm(this.nextAction());

    this.focusForm();
  }

  openMandatory(): void {
    this.scrollIntoView();

    this.resetForm();

    this.nextActionMode.set('mandatory');

    this.focusForm();
  }

  openStatusChange(): void {
    this.scrollIntoView();

    this.resetForm();

    this.nextActionMode.set('status-change');
  }

  requestClose(): void {
    if (this.isBlocking()) {
      return;
    }

    this.executeOrConfirm(this.form.dirty, () => this.close());
  }
}

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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SelectMenu } from '../../../../shared/components/select-menu/select-menu';
import { DateFormatPipe } from '../../../../shared/pipes/date-format-pipe';

import {
  OPPORTUNITY_EVENT_TYPES,
  OPPORTUNITY_STATUSES,
} from '../../constants/opportunity.constants';

import { NextAction } from '../../models/next-action.model';

import { OpportunityEventType, OpportunityStatus } from '../../types/opportunity.type';

@Component({
  selector: 'app-next-action-card',

  standalone: true,

  imports: [DateFormatPipe, ReactiveFormsModule, SelectMenu],

  templateUrl: './next-action-card.html',

  styleUrl: './next-action-card.scss',
})
export class NextActionCard {
  readonly nextAction = input<NextAction | null>();

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

  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.group({
    type: this.formBuilder.control<OpportunityEventType>(this.manualEventTypes[0].value, {
      validators: Validators.required,
      nonNullable: true,
    }),

    label: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),

    dueDate: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
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
    this.nextAction() ? this.setMode('edit') : this.setMode('create');
  }

  openMandatory(): void {
    this.setMode('mandatory');
  }

  openStatusChange(): void {
    this.setMode('status-change');
  }

  isBlocking(): boolean {
    return this.nextActionMode() === 'mandatory' || this.nextActionMode() === 'status-change';
  }

  private setMode(mode: NextActionMode): void {
    this.scrollIntoView();

    this.nextActionMode.set(mode);

    const nextAction = this.nextAction();

    this.form.reset({
      type: mode === 'edit' && nextAction ? nextAction.type : this.manualEventTypes[0].value,
      label: mode === 'edit' && nextAction ? nextAction.label : '',
      dueDate: mode === 'edit' && nextAction ? nextAction.dueDate : '',
    });

    if (mode !== 'status-change') {
      queueMicrotask(() => {
        this.nextActionLabel()?.nativeElement.focus();
      });
    }
  }

  scrollIntoView(): void {
    this.container()?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  close(): void {
    if (this.isBlocking()) {
      return;
    }

    this.nextActionMode.set('view');

    this.form.reset({
      type: this.manualEventTypes[0].value,
      label: '',
      dueDate: '',
    });
  }

  selectNextActionType(type: string): void {
    this.form.controls.type.setValue(type as OpportunityEventType);
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    this.update.emit({
      type: this.form.controls.type.value,
      label: this.form.controls.label.value.trim(),
      dueDate: this.form.controls.dueDate.value,
    });

    this.form.reset({
      type: this.manualEventTypes[0].value,
      label: '',
      dueDate: '',
    });

    this.nextActionMode.set('view');
  }

  completeAction(): void {
    this.complete.emit();

    this.openMandatory();
  }

  completeForStatusChangeAction(): void {
    this.nextActionMode.set('view');

    this.completeForStatusChange.emit();
  }

  deleteForStatusChangeAction(): void {
    this.nextActionMode.set('view');

    this.deleteForStatusChange.emit();
  }

  cancelStatusChange(): void {
    this.nextActionMode.set('view');

    this.statusChangeCancelled.emit();
  }
}

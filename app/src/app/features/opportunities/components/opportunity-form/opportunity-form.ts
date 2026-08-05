import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Modal } from '../../../../shared/components/modal/modal';
import { SelectMenu } from '../../../../shared/components/select-menu/select-menu';

import { COMPANY_TYPES } from '../../../../shared/constants/company.constants';
import { DURATION_UNITS } from '../../../../shared/constants/duration.constants';
import { SENIORITIES } from '../../../../shared/constants/seniority.constants';
import { WORK_MODALITIES } from '../../../../shared/constants/work-modality.constants';

import { CompanyType } from '../../../../shared/types/company.type';
import { DurationUnit } from '../../../../shared/types/duration.type';
import { Seniority } from '../../../../shared/types/seniority.type';
import { WorkModality } from '../../../../shared/types/work-modality.type';

import { OPPORTUNITY_EVENT_TYPES } from '../../constants/opportunity.constants';

import { CreateOpportunityCommand } from '../../commands/create-opportunity.command';
import { UpdateOpportunityCommand } from '../../commands/update-opportunity.command';
import { Opportunity } from '../../models/opportunity.model';
import { OpportunityEventType } from '../../types/opportunity.type';

import { DiscardChangesModal } from '../../../../shared/components/discard-changes-modal/discard-changes-modal';
import { FormInteractionHandler } from '../../../../shared/utils/form-interaction-handler';
import { notBlank } from '../../../../shared/validator/not-blank.validator';
import { durationValidator } from '../../../../shared/validator/duration.validator';
import { stackValidator } from '../../../../shared/validator/stack.validator';

@Component({
  selector: 'app-opportunity-form',
  standalone: true,
  imports: [Modal, ReactiveFormsModule, SelectMenu, DiscardChangesModal],
  templateUrl: './opportunity-form.html',
  styleUrl: './opportunity-form.scss',
})
export class OpportunityForm extends FormInteractionHandler {
  readonly opportunity = input<Opportunity | null>(null);

  readonly isEditMode = computed(() => this.opportunity() !== null);

  /*
    The dialog adapts its title according
    to the current workflow.
  */
  readonly title = computed(() =>
    this.isEditMode() ? 'Modifier une opportunité' : 'Nouvelle opportunité',
  );

  /*
    Submit actions reflect whether the
    opportunity is created or updated.
  */
  readonly submitLabel = computed(() =>
    this.isEditMode() ? 'Enregistrer' : "Créer l'opportunité",
  );

  readonly closed = output<void>();

  readonly created = output<CreateOpportunityCommand>();

  readonly updated = output<UpdateOpportunityCommand>();

  private readonly formBuilder = inject(NonNullableFormBuilder);

  /*
    Select options are centralized through
    shared business constants.
  */
  readonly companyTypes = Object.values(COMPANY_TYPES);

  readonly modalities = Object.values(WORK_MODALITIES);

  readonly durationUnits = Object.values(DURATION_UNITS);

  readonly seniorities = Object.values(SENIORITIES);

  readonly nextActionTypes = [
    OPPORTUNITY_EVENT_TYPES.CALL,
    OPPORTUNITY_EVENT_TYPES.EMAIL,
    OPPORTUNITY_EVENT_TYPES.MEETING,
  ];

  constructor() {
    super();

    this.initializeForm();
  }

  readonly form = this.formBuilder.group(
    {
      companyName: ['', [Validators.required, Validators.maxLength(100), notBlank()]],
      companyType: this.formBuilder.control<CompanyType | ''>(''),
      industry: ['', Validators.maxLength(100)],
      source: ['', [Validators.required, Validators.maxLength(100), notBlank()]],
      contactName: ['', Validators.maxLength(100)],
      contactRole: ['', Validators.maxLength(100)],
      contactEmail: ['', [Validators.email, Validators.maxLength(254)]],
      missionTitle: ['', [Validators.required, Validators.maxLength(150), notBlank()]],
      description: [''],
      tjm: [undefined as number | undefined, Validators.min(0.01)],
      daysPerWeek: [undefined as number | undefined, [Validators.min(1), Validators.max(7)]],
      modality: this.formBuilder.control<WorkModality | ''>(''),
      location: ['', Validators.maxLength(150)],
      estimatedStartDate: [''],
      durationValue: [undefined as number | undefined, Validators.min(1)],
      durationUnit: this.formBuilder.control<DurationUnit | ''>(''),
      seniority: this.formBuilder.control<Seniority | ''>(''),
      stack: ['', stackValidator()],
      nextAction: this.formBuilder.group({
        type: this.formBuilder.control<OpportunityEventType | ''>('', Validators.required),
        label: ['', [Validators.required, notBlank()]],
        dueDate: ['', Validators.required],
      }),
    },
    {
      validators: durationValidator(),
    },
  );

  requestClose(): void {
    this.executeOrConfirm(this.form.dirty, () => this.closed.emit());
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    if (this.isEditMode()) {
      this.updateOpportunity();

      return;
    }

    this.createOpportunity();
  }

  /*
    Handle opportunity creation workflow.
  */
  private createOpportunity(): void {
    this.created.emit(this.createCommand());
  }

  /*
    Handle opportunity update workflow.
  */
  private updateOpportunity(): void {
    const command = this.updateCommand();

    this.updated.emit(command);
  }

  /*
    Restore the default creation state
    and clear all form interactions.
  */
  private resetForm(): void {
    this.form.reset({
      companyType: '',
      modality: '',
      durationUnit: '',
      seniority: '',

      nextAction: {
        type: '',
        label: '',
        dueDate: '',
      },
    });

    this.form.markAsPristine();

    this.form.markAsUntouched();
  }

  /*
    Build the business command from the
    current form values.
  */
  private createCommand(): CreateOpportunityCommand {
    return {
      ...this.buildOpportunityData(),

      nextAction: {
        type: this.form.controls.nextAction.controls.type.value as OpportunityEventType,
        label: this.form.controls.nextAction.controls.label.value,
        dueDate: this.form.controls.nextAction.controls.dueDate.value,
      },
    };
  }

  /*
    Build the update command from the
    current form values.
  */
  private updateCommand(): UpdateOpportunityCommand {
    return {
      id: this.opportunity()!.id,

      ...this.buildOpportunityData(),
    };
  }

  /*
    Extract business data shared by
    creation and update workflows.
  */
  private buildOpportunityData(): Omit<CreateOpportunityCommand, 'nextAction'> {
    const value = this.form.getRawValue();

    return {
      companyName: value.companyName,
      companyType: value.companyType || undefined,
      industry: value.industry || undefined,
      source: value.source,

      contactName: value.contactName || undefined,
      contactRole: value.contactRole || undefined,
      contactEmail: value.contactEmail || undefined,

      missionTitle: value.missionTitle,
      description: value.description || undefined,

      tjm: value.tjm,
      daysPerWeek: value.daysPerWeek,

      modality: value.modality || undefined,
      location: value.location || undefined,

      estimatedStartDate: value.estimatedStartDate || undefined,

      durationValue: value.durationValue,
      durationUnit: value.durationUnit || undefined,

      seniority: value.seniority || undefined,

      stack: value.stack
        .split(',')
        .map((technology) => technology.trim())
        .filter((technology) => technology.length > 0),
    };
  }

  /*
    Keep the form synchronized with the
    currently edited opportunity.
  */
  private initializeForm(): void {
    effect(() => {
      const opportunity = this.opportunity();

      if (!opportunity) {
        this.form.controls.nextAction.enable({ emitEvent: false });

        this.resetForm();

        return;
      }

      this.form.controls.nextAction.disable({ emitEvent: false });

      this.form.reset({
        companyName: opportunity.companyName,
        companyType: opportunity.companyType ?? '',
        industry: opportunity.industry ?? '',
        source: opportunity.source,

        contactName: opportunity.contactName ?? '',
        contactRole: opportunity.contactRole ?? '',
        contactEmail: opportunity.contactEmail ?? '',

        missionTitle: opportunity.missionTitle,
        description: opportunity.description ?? '',

        tjm: opportunity.tjm,
        daysPerWeek: opportunity.daysPerWeek,

        modality: opportunity.modality ?? '',
        location: opportunity.location ?? '',

        estimatedStartDate: opportunity.estimatedStartDate ?? '',

        durationValue: opportunity.durationValue,
        durationUnit: opportunity.durationUnit ?? '',

        seniority: opportunity.seniority ?? '',

        stack: opportunity.stack.join(', '),
      });

      this.form.markAsPristine();
      this.form.markAsUntouched();
    });
  }
}

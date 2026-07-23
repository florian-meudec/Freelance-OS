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
import { OpportunityMapper } from '../../mappers/opportunity.mapper';
import { Opportunity } from '../../models/opportunity.model';
import { OpportunityEventType } from '../../types/opportunity.type';

import { DiscardChangesModal } from '../../../../shared/components/discard-changes-modal/discard-changes-modal';
import { FormInteractionHandler } from '../../../../shared/utils/form-interaction-handler';

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

  readonly created = output<Opportunity>();

  readonly updated = output<Opportunity>();

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

  readonly form = this.formBuilder.group({
    companyName: ['', Validators.required],
    companyType: this.formBuilder.control<CompanyType | ''>(''),
    industry: [''],
    source: ['', Validators.required],

    contactName: [''],
    contactRole: [''],
    contactEmail: ['', Validators.email],

    missionTitle: ['', Validators.required],
    description: [''],

    tjm: [undefined as number | undefined],
    daysPerWeek: [undefined as number | undefined],
    modality: this.formBuilder.control<WorkModality | ''>(''),
    location: [''],

    estimatedStartDate: [''],

    durationValue: [undefined as number | undefined],
    durationUnit: this.formBuilder.control<DurationUnit | ''>(''),

    seniority: this.formBuilder.control<Seniority | ''>(''),

    stack: [''],

    nextAction: this.formBuilder.group({
      type: this.formBuilder.control<OpportunityEventType | ''>('', Validators.required),
      label: ['', Validators.required],
      dueDate: ['', Validators.required],
    }),
  });

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
    const command = this.createCommand();

    const opportunity = OpportunityMapper.toOpportunity(command);

    this.created.emit(opportunity);
  }

  /*
    Handle opportunity update workflow.
  */
  private updateOpportunity(): void {
    const command = this.updateCommand();

    const opportunity = OpportunityMapper.update(this.opportunity()!, command);

    this.updated.emit(opportunity);
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

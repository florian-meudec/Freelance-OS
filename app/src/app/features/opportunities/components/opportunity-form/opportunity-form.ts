import { Component, inject, output } from '@angular/core';
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
import { OpportunityMapper } from '../../mappers/opportunity.mapper';
import { Opportunity } from '../../models/opportunity.model';
import { OpportunityEventType } from '../../types/opportunity.type';

@Component({
  selector: 'app-opportunity-form',
  standalone: true,
  imports: [Modal, ReactiveFormsModule, SelectMenu],
  templateUrl: './opportunity-form.html',
  styleUrl: './opportunity-form.scss',
})
export class OpportunityForm {
  readonly closed = output<void>();

  readonly created = output<Opportunity>();

  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly companyTypes = Object.values(COMPANY_TYPES);

  readonly modalities = Object.values(WORK_MODALITIES);

  readonly durationUnits = Object.values(DURATION_UNITS);

  readonly seniorities = Object.values(SENIORITIES);

  readonly nextActionTypes = [
    OPPORTUNITY_EVENT_TYPES.CALL,
    OPPORTUNITY_EVENT_TYPES.EMAIL,
    OPPORTUNITY_EVENT_TYPES.MEETING,
  ];

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
    workload: [undefined as number | undefined],
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
    this.closed.emit();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }
    const command = this.createCommand();
    const opportunity = OpportunityMapper.toOpportunity(command);

    this.created.emit(opportunity);
  }

  /*
    Build the business command from the
    current form values.
  */
  private createCommand(): CreateOpportunityCommand {
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
      workload: value.workload,
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

      nextAction: {
        type: value.nextAction.type as OpportunityEventType,
        label: value.nextAction.label,
        dueDate: value.nextAction.dueDate,
      },
    };
  }
}

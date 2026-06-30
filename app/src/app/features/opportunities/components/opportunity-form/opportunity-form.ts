import { Component, inject, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Modal } from '../../../../shared/components/modal/modal';
import { SelectMenu } from '../../../../shared/components/select-menu/select-menu';

import { COMPANY_TYPES } from '../../../../shared/constants/company.constants';
import { DURATION_UNITS } from '../../../../shared/constants/duration.constants';
import { SENIORITIES } from '../../../../shared/constants/seniority.constants';
import { WORK_MODALITIES } from '../../../../shared/constants/work-modality.constants';

import { OPPORTUNITY_EVENT_TYPES } from '../../constants/opportunity.constants';

@Component({
  selector: 'app-opportunity-form',
  standalone: true,
  imports: [Modal, ReactiveFormsModule, SelectMenu],
  templateUrl: './opportunity-form.html',
  styleUrl: './opportunity-form.scss',
})
export class OpportunityForm {
  readonly closed = output<void>();

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
    companyType: [''],
    industry: [''],
    source: ['', Validators.required],

    contactName: [''],
    contactRole: [''],
    contactEmail: ['', Validators.email],

    missionTitle: ['', Validators.required],
    description: [''],

    tjm: [undefined as number | undefined],
    workload: [undefined as number | undefined],

    modality: [''],
    location: [''],

    estimatedStartDate: [''],

    durationValue: [undefined as number | undefined],
    durationUnit: [''],

    seniority: [''],

    stack: [''],

    nextAction: this.formBuilder.group({
      type: ['', Validators.required],
      label: ['', Validators.required],
      dueDate: ['', Validators.required],
    }),
  });

  requestClose(): void {
    this.closed.emit();
  }

  submit(): void {
    console.log(this.form.getRawValue());
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    console.log(this.form.getRawValue());
  }
}

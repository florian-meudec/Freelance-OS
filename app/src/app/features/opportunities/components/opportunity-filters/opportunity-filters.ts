import { Component, input, output } from '@angular/core';

import { DEFAULT_OPPORTUNITY_FILTERS } from '../../constants/opportunity.constants';
import {
  COMPANY_TYPE_OPTIONS,
  MINIMUM_DAILY_RATE_OPTIONS,
  MODALITY_OPTIONS,
  NEXT_ACTION_DUE_OPTIONS,
  SENIORITY_OPTIONS,
} from '../../constants/opportunity-filter-options.constants';
import { NextActionDueInDays, OpportunityFilters } from '../../models/opportunity-filters';
import { CompanyType } from '../../../../shared/types/company.type';
import { Seniority } from '../../../../shared/types/seniority.type';
import { WorkModality } from '../../../../shared/types/work-modality.type';

@Component({
  selector: 'app-opportunity-filters',
  standalone: true,
  imports: [],
  templateUrl: './opportunity-filters.html',
  styleUrl: './opportunity-filters.scss',
})
export class OpportunityFiltersComponent {
  readonly filters = input.required<OpportunityFilters>();

  readonly nextActionDueCounts = input<Record<string, number>>({});

  /*
    Available sources are derived from the
    current opportunity collection.
  */
  readonly availableSources = input.required<string[]>();

  readonly filtersChange = output<OpportunityFilters>();

  /*
    Filter options remain centralized to
    keep UI labels consistent.
  */
  readonly modalityOptions = MODALITY_OPTIONS;

  readonly seniorityOptions = SENIORITY_OPTIONS;

  readonly companyTypeOptions = COMPANY_TYPE_OPTIONS;

  readonly minimumDailyRateOptions = MINIMUM_DAILY_RATE_OPTIONS;

  readonly nextActionDueOptions = NEXT_ACTION_DUE_OPTIONS;

  getNextActionDueCount(value: NextActionDueInDays): number {
    return this.nextActionDueCounts()[String(value)] ?? 0;
  }

  toggleModality(modality: WorkModality): void {
    const filters = this.filters();

    this.filtersChange.emit({
      ...filters,
      modalities: this.toggleArrayValue(filters.modalities, modality),
    });
  }

  toggleSeniority(seniority: Seniority): void {
    const filters = this.filters();

    this.filtersChange.emit({
      ...filters,
      seniorities: this.toggleArrayValue(filters.seniorities, seniority),
    });
  }

  toggleCompanyType(companyType: CompanyType): void {
    const filters = this.filters();

    this.filtersChange.emit({
      ...filters,
      companyTypes: this.toggleArrayValue(filters.companyTypes, companyType),
    });
  }

  toggleSource(source: string): void {
    const filters = this.filters();

    this.filtersChange.emit({
      ...filters,
      sources: this.toggleArrayValue(filters.sources, source),
    });
  }

  setMinimumDailyRate(minimumDailyRate: number | null): void {
    this.filtersChange.emit({
      ...this.filters(),
      minimumDailyRate,
    });
  }

  toggleNextActionDueInDays(nextActionDueInDays: NextActionDueInDays): void {
    const filters = this.filters();

    this.filtersChange.emit({
      ...filters,
      nextActionDueInDays: this.toggleArrayValue(filters.nextActionDueInDays, nextActionDueInDays),
    });
  }

  reset(): void {
    this.filtersChange.emit(structuredClone(DEFAULT_OPPORTUNITY_FILTERS));
  }

  /*
    Toggle a value inside a filter collection
    while preserving immutability.
  */
  private toggleArrayValue<T>(values: T[], value: T): T[] {
    return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
  }
}

import { CompanyType } from '../../../shared/types/company.type';
import { Seniority } from '../../../shared/types/seniority.type';
import { WorkModality } from '../../../shared/types/work-modality.type';
import { NextActionDueInDays } from '../models/opportunity-filters';

type FilterOption<T> = {
  value: T;
  label: string;
};

export const MODALITY_OPTIONS: FilterOption<WorkModality>[] = [
  {
    value: 'remote',
    label: 'Télétravail',
  },
  {
    value: 'hybrid',
    label: 'Hybride',
  },
  {
    value: 'onsite',
    label: 'Sur site',
  },
];

export const SENIORITY_OPTIONS: FilterOption<Seniority>[] = [
  {
    value: 'junior',
    label: 'Junior',
  },
  {
    value: 'confirmed',
    label: 'Confirmé',
  },
  {
    value: 'senior',
    label: 'Senior',
  },
  {
    value: 'lead',
    label: 'Lead',
  },
];

export const COMPANY_TYPE_OPTIONS: FilterOption<CompanyType>[] = [
  {
    value: 'client-final',
    label: 'Client final',
  },
  {
    value: 'esn',
    label: 'ESN',
  },
  {
    value: 'cabinet',
    label: 'Cabinet',
  },
  {
    value: 'startup',
    label: 'Startup',
  },
];

export const MINIMUM_DAILY_RATE_OPTIONS: FilterOption<number | null>[] = [
  {
    value: null,
    label: 'Aucun',
  },
  {
    value: 400,
    label: '400 €',
  },
  {
    value: 500,
    label: '500 €',
  },
  {
    value: 600,
    label: '600 €',
  },
  {
    value: 700,
    label: '700 €',
  },
];

export const NEXT_ACTION_DUE_OPTIONS: FilterOption<NextActionDueInDays>[] = [
  {
    value: 0,
    label: "Aujourd'hui",
  },
  {
    value: 1,
    label: 'Demain',
  },
  {
    value: 2,
    label: 'Dans 2 J',
  },
  {
    value: 3,
    label: 'Dans 3 J',
  },
  {
    value: 4,
    label: 'Dans 4 J',
  },
  {
    value: 5,
    label: 'Dans 5 J',
  },
  {
    value: 6,
    label: 'Dans 6 J',
  },
  {
    value: 7,
    label: 'Dans 7 J',
  },
  {
    value: '7-plus',
    label: '7+ jours',
  },
];

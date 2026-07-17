import { CompanyType } from '../../../shared/types/company.type';
import { Seniority } from '../../../shared/types/seniority.type';
import { WorkModality } from '../../../shared/types/work-modality.type';

export const MODALITY_OPTIONS: {
  value: WorkModality;
  label: string;
}[] = [
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

export const SENIORITY_OPTIONS: {
  value: Seniority;
  label: string;
}[] = [
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

export const COMPANY_TYPE_OPTIONS: {
  value: CompanyType;
  label: string;
}[] = [
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

export const MINIMUM_DAILY_RATE_OPTIONS: {
  value: number | null;
  label: string;
}[] = [
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

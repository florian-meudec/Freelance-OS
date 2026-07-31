import { COMPANY_TYPES } from '../../../../shared/constants/company.constants';
import { CompanyType } from '../../../../shared/types/company.type';

export const COMPANY_TYPE_MAPPING: Record<string, CompanyType> = {
  esn: COMPANY_TYPES.ESN.value,
  cabinet: COMPANY_TYPES.CABINET.value,
  'client-final': COMPANY_TYPES.CLIENT_FINAL.value,
  startup: COMPANY_TYPES.STARTUP.value,
};

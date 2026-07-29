import { COMPANY_TYPES } from '../../../../shared/constants/company.constants';
import { CompanyType } from '../../../../shared/types/company.type';

export const COMPANY_TYPE_MAPPING: Record<string, CompanyType> = {
  ESN: COMPANY_TYPES.ESN.value,
  CABINET: COMPANY_TYPES.CABINET.value,
  CLIENT_FINAL: COMPANY_TYPES.CLIENT_FINAL.value,
  STARTUP: COMPANY_TYPES.STARTUP.value,
};

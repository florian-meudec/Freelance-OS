import { COMPANY_TYPES } from '../constants/company.constants';

/*
  Utility type used to extract values from constant objects
  while preserving full TypeScript inference.
*/
type ValueOf<T> = T[keyof T];

/*
  Company types remain shared across
  opportunities, clients and missions.
*/
export type CompanyType = ValueOf<typeof COMPANY_TYPES>['value'];

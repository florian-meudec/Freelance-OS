import { SENIORITIES } from '../constants/seniority.constants';

/*
  Utility type used to extract values from constant objects
  while preserving full TypeScript inference.
*/
type ValueOf<T> = T[keyof T];

/*
  Seniority levels remain shared across
  opportunities, missions and candidate profiles.
*/
export type Seniority = ValueOf<typeof SENIORITIES>['value'];

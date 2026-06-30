import { WORK_MODALITIES } from '../constants/work-modality.constants';

/*
  Utility type used to extract values from constant objects
  while preserving full TypeScript inference.
*/
type ValueOf<T> = T[keyof T];

/*
  Work modalities remain shared across
  opportunities, missions and contracts.
*/
export type WorkModality = ValueOf<typeof WORK_MODALITIES>['value'];

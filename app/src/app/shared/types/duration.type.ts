import { DURATION_UNITS } from '../constants/duration.constants';

/*
  Utility type used to extract values from constant objects
  while preserving full TypeScript inference.
*/
type ValueOf<T> = T[keyof T];

/*
  Duration units remain shared across
  business entities requiring time estimates.
*/
export type DurationUnit = ValueOf<typeof DURATION_UNITS>['value'];

/*
  Duration units remain shared across
  business entities requiring time estimates.
*/
export const DURATION_UNITS = {
  DAYS: {
    value: 'days',
    label: 'Jours',
  },

  WEEKS: {
    value: 'weeks',
    label: 'Semaines',
  },

  MONTHS: {
    value: 'months',
    label: 'Mois',
  },

  YEARS: {
    value: 'years',
    label: 'Années',
  },
} as const;

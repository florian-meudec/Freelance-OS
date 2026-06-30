/*
  Seniority levels remain shared across
  opportunities, missions and candidate profiles.
*/
export const SENIORITIES = {
  JUNIOR: {
    value: 'junior',
    label: 'Junior',
  },

  CONFIRMED: {
    value: 'confirmed',
    label: 'Confirmé',
  },

  SENIOR: {
    value: 'senior',
    label: 'Senior',
  },

  LEAD: {
    value: 'lead',
    label: 'Lead',
  },
} as const;

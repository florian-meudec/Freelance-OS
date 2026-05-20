export const OPPORTUNITY_STATUSES = {
  LEAD: 'lead',
  CONTACTED: 'contacted',
  INTERVIEW: 'interview',
  PROPOSAL: 'proposal',
  NEGOTIATION: 'negotiation',
  WON: 'won',
  LOST: 'lost',
} as const;

export const OPPORTUNITY_MODALITIES = {
  REMOTE: {
    value: 'remote',
    label: 'Télétravail',
  },

  HYBRID: {
    value: 'hybrid',
    label: 'Hybride',
  },

  ONSITE: {
    value: 'onsite',
    label: 'Sur site',
  },
} as const;

export const OPPORTUNITY_URGENCIES = {
  LATE: {
    value: 'late',
    threshold: 0,
  },

  TODAY: {
    value: 'today',
    threshold: 0,
  },

  THIS_WEEK: {
    value: 'this-week',
    threshold: 7,
  },

  WAITING: {
    value: 'waiting',
  },
} as const;

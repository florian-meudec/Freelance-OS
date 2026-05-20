export const OPPORTUNITY_STATUSES = {
  LEAD: {
    value: 'lead',
    label: 'Lead',
    order: 1,
  },

  CONTACTED: {
    value: 'contacted',
    label: 'Contacté',
    order: 2,
  },

  INTERVIEW: {
    value: 'interview',
    label: 'Entretien',
    order: 3,
  },

  PROPOSAL: {
    value: 'proposal',
    label: 'Proposition',
    order: 4,
  },

  NEGOTIATION: {
    value: 'negotiation',
    label: 'Négociation',
    order: 5,
  },

  WON: {
    value: 'won',
    label: 'Gagné',
    order: 6,
  },

  LOST: {
    value: 'lost',
    label: 'Perdu',
    order: 7,
  },
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

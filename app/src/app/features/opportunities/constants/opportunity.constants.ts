/*
  Kanban statuses define both the business workflow
  and the visual order of board columns.
*/
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

/*
  Modalities stay centralized to keep labels,
  filters and future business rules consistent.
*/
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

/*
  Urgency levels drive visual prioritization
  based on upcoming follow-up deadlines.
*/
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

export const COMPANY_TYPES = {
  CLIENT_FINAL: {
    value: 'client-final',
    label: 'Client final',
  },

  ESN: {
    value: 'esn',
    label: 'ESN',
  },

  CABINET: {
    value: 'cabinet',
    label: 'Cabinet',
  },

  STARTUP: {
    value: 'startup',
    label: 'Startup',
  },
} as const;

export const OPPORTUNITY_SENIORITIES = {
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

/*
  Timeline events describe important
  opportunity lifecycle actions.
*/
export const OPPORTUNITY_EVENT_TYPES = {
  CREATED: {
    value: 'created',
    label: 'Création',
  },

  STATUS_CHANGED: {
    value: 'status-changed',
    label: 'Changement de statut',
  },

  CALL: {
    value: 'call',
    label: 'Appel',
  },

  EMAIL: {
    value: 'email',
    label: 'Email',
  },

  MEETING: {
    value: 'meeting',
    label: 'Entretien',
  },
} as const;

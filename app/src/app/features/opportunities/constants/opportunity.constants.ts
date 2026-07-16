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

export const OPPORTUNITY_QUICK_VIEWS = {
  TODO: {
    value: 'todo',
    label: 'À traiter',
  },

  PREPARE: {
    value: 'prepare',
    label: 'À préparer',
  },

  ALL: {
    value: 'all',
    label: 'Toutes',
  },
} as const;

export type OpportunityQuickView =
  (typeof OPPORTUNITY_QUICK_VIEWS)[keyof typeof OPPORTUNITY_QUICK_VIEWS]['value'];

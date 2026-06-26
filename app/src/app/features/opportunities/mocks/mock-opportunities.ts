import {
  COMPANY_TYPES,
  DURATION_UNITS,
  OPPORTUNITY_EVENT_TYPES,
  OPPORTUNITY_MODALITIES,
  OPPORTUNITY_SENIORITIES,
  OPPORTUNITY_STATUSES,
} from '../constants/opportunity.constants';
import { Opportunity } from '../models/opportunity.model';

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',

    companyName: 'UBS',
    companyType: COMPANY_TYPES.CLIENT_FINAL.value,
    industry: 'Banque',

    source: 'LinkedIn',

    contactName: 'Sophie Meier',
    contactRole: 'Engineering Manager',

    missionTitle: 'Angular Migration',

    description:
      'Migration Angular 15 vers Angular 20 avec modernisation de l’architecture frontend.',

    stack: ['Angular', 'TypeScript', 'Nx', 'Jest'],

    seniority: OPPORTUNITY_SENIORITIES.SENIOR.value,

    estimatedStartDate: '2026-06-15',

    durationValue: 12,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.CONTACTED.value,

    tjm: 750,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.HYBRID.value,
    location: 'Zürich',

    nextAction: {
      type: OPPORTUNITY_EVENT_TYPES.EMAIL.value,
      label: 'Premier contact LinkedIn',
      dueDate: '2026-06-20',
    },

    events: [
      {
        id: 'event-1',

        type: OPPORTUNITY_EVENT_TYPES.CREATED.value,

        createdAt: '2026-05-10T09:00:00',
      },

      {
        id: 'event-2',

        type: OPPORTUNITY_EVENT_TYPES.STATUS_CHANGED.value,

        status: OPPORTUNITY_STATUSES.CONTACTED.value,

        createdAt: '2026-05-11T14:00:00',
      },

      {
        id: 'event-3',

        type: OPPORTUNITY_EVENT_TYPES.CREATED.value,

        createdAt: '2026-05-15T10:00:00',

        comment: 'Premier message LinkedIn envoyé.',
      },
    ],

    notes: [
      {
        id: 'note-1',

        title: 'Validation budget',

        createdAt: '2026-05-18T14:00:00',

        content: 'Le client semble vouloir démarrer rapidement après validation budget.',
      },

      {
        id: 'note-2',

        title: 'Entretien technique',

        createdAt: '2026-05-20T09:30:00',

        content: 'Très bon échange technique avec le lead frontend.',
      },
    ],
  },

  {
    id: '2',

    companyName: 'Swisscom',
    companyType: COMPANY_TYPES.CLIENT_FINAL.value,
    industry: 'Télécom',

    source: 'Malt',

    contactName: 'Thomas Keller',
    contactRole: 'Tech Recruiter',
    contactEmail: 'thomas.keller@swisscom.com',

    missionTitle: 'Spring Boot API',

    description: 'Création et maintenance d’APIs Spring Boot pour les services clients internes.',

    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],

    seniority: OPPORTUNITY_SENIORITIES.CONFIRMED.value,

    estimatedStartDate: '2026-07-01',

    durationValue: 6,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.PROPOSAL.value,

    tjm: 820,
    workload: 4,

    modality: OPPORTUNITY_MODALITIES.REMOTE.value,
    location: 'Berne',

    nextAction: {
      type: OPPORTUNITY_EVENT_TYPES.EMAIL.value,
      label: 'Envoyer proposition commerciale',
      dueDate: '2026-06-26',
    },

    events: [
      {
        id: 'event-4',

        type: OPPORTUNITY_EVENT_TYPES.CREATED.value,

        createdAt: '2026-05-05T08:30:00',
      },

      {
        id: 'event-5',

        type: OPPORTUNITY_EVENT_TYPES.CALL.value,

        createdAt: '2026-05-09T16:00:00',

        comment: 'Relance email effectuée.',
      },

      {
        id: 'event-6',

        type: OPPORTUNITY_EVENT_TYPES.STATUS_CHANGED.value,

        status: OPPORTUNITY_STATUSES.PROPOSAL.value,

        createdAt: '2026-05-18T11:30:00',
      },
    ],

    notes: [
      {
        id: 'note-3',

        title: 'Négociation TJM',

        createdAt: '2026-05-17T18:00:00',

        content: 'Le TJM proposé semble acceptable pour le client.',
      },
    ],
  },

  {
    id: '3',

    companyName: 'Doctolib',
    companyType: COMPANY_TYPES.STARTUP.value,
    industry: 'Santé',

    source: 'LinkedIn',

    contactName: 'Emma Laurent',
    contactRole: 'Talent Partner',
    contactEmail: 'emma.laurent@doctolib.com',

    missionTitle: 'Frontend Platform',

    description:
      'Participation à l’évolution de la plateforme frontend interne et du design system.',

    stack: ['Angular', 'TypeScript', 'Storybook', 'Cypress'],

    seniority: OPPORTUNITY_SENIORITIES.SENIOR.value,

    estimatedStartDate: '2026-06-20',

    durationValue: 9,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.NEGOTIATION.value,

    tjm: 850,
    workload: 4,

    modality: OPPORTUNITY_MODALITIES.REMOTE.value,
    location: 'Paris',

    nextAction: {
      type: OPPORTUNITY_EVENT_TYPES.EMAIL.value,
      label: 'Validation budget',
      dueDate: '2026-06-27',
    },

    events: [
      {
        id: 'event-7',

        type: OPPORTUNITY_EVENT_TYPES.CREATED.value,

        createdAt: '2026-05-01T09:00:00',
      },

      {
        id: 'event-8',

        type: OPPORTUNITY_EVENT_TYPES.STATUS_CHANGED.value,

        status: OPPORTUNITY_STATUSES.INTERVIEW.value,

        createdAt: '2026-05-08T15:00:00',
      },

      {
        id: 'event-9',

        type: OPPORTUNITY_EVENT_TYPES.STATUS_CHANGED.value,

        status: OPPORTUNITY_STATUSES.NEGOTIATION.value,

        createdAt: '2026-05-15T17:00:00',
      },
    ],

    notes: [
      {
        id: 'note-4',

        title: 'Premier entretien',

        createdAt: '2026-05-16T11:00:00',

        content: 'Très bon feeling avec l’équipe produit pendant l’entretien.',
      },

      {
        id: 'note-5',

        title: 'Process validation',

        createdAt: '2026-05-19T08:45:00',

        content: 'Attention au délai de validation interne qui semble long.',
      },
    ],
  },

  {
    id: '4',

    companyName: 'SNCF Connect',
    companyType: COMPANY_TYPES.CLIENT_FINAL.value,
    industry: 'Transport',

    source: 'Meetup',

    contactName: 'Antoine Mercier',
    contactRole: 'Engineering Manager',
    contactEmail: 'antoine.mercier@sncf-connect.com',

    missionTitle: 'Design System Angular',

    description:
      'Refonte et industrialisation du design system Angular utilisé par plusieurs équipes produit.',

    stack: ['Angular', 'SCSS', 'Storybook', 'Nx'],

    seniority: OPPORTUNITY_SENIORITIES.LEAD.value,

    estimatedStartDate: '2026-08-01',

    durationValue: 18,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.INTERVIEW.value,

    tjm: 780,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.HYBRID.value,
    location: 'Lyon',

    nextAction: {
      type: OPPORTUNITY_EVENT_TYPES.CALL.value,
      label: 'Entretien technique',
      dueDate: '2026-06-29',
    },

    events: [
      {
        id: 'event-10',

        type: OPPORTUNITY_EVENT_TYPES.CREATED.value,

        createdAt: '2026-05-12T10:00:00',
      },

      {
        id: 'event-11',

        type: OPPORTUNITY_EVENT_TYPES.CALL.value,

        createdAt: '2026-05-14T13:00:00',

        comment: 'Premier call RH effectué.',
      },

      {
        id: 'event-12',

        type: OPPORTUNITY_EVENT_TYPES.STATUS_CHANGED.value,

        status: OPPORTUNITY_STATUSES.INTERVIEW.value,

        createdAt: '2026-05-16T09:30:00',
      },
    ],

    notes: [
      {
        id: 'note-6',

        title: 'Scope technique',

        createdAt: '2026-05-17T12:15:00',

        content: 'Le scope semble très intéressant techniquement.',
      },
    ],
  },
  {
    id: '5',

    companyName: 'Spotify',
    companyType: COMPANY_TYPES.CLIENT_FINAL.value,
    industry: 'Streaming',

    source: 'LinkedIn',

    contactName: 'Anna Svensson',
    contactRole: 'Engineering Manager',
    contactEmail: 'anna.svensson@spotify.com',

    missionTitle: 'Angular Platform',

    description: 'Mission plateforme frontend.',

    stack: ['Angular', 'Nx'],

    seniority: OPPORTUNITY_SENIORITIES.SENIOR.value,

    estimatedStartDate: '2026-07-15',

    durationValue: 12,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.CONTACTED.value,

    tjm: 850,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.HYBRID.value,
    location: 'Stockholm',

    nextAction: {
      type: OPPORTUNITY_EVENT_TYPES.CALL.value,
      label: 'Préparer le premier entretien',
      dueDate: '2026-07-08',
    },

    events: [],

    notes: [],
  },

  {
    id: '6',

    companyName: 'Datadog',
    companyType: COMPANY_TYPES.CLIENT_FINAL.value,
    industry: 'Monitoring',

    source: 'Malt',

    contactName: 'John Miller',
    contactRole: 'Tech Lead',
    contactEmail: 'john.miller@datadog.com',

    missionTitle: 'Frontend Platform',

    description: 'Mission plateforme.',

    stack: ['Angular'],

    seniority: OPPORTUNITY_SENIORITIES.LEAD.value,

    estimatedStartDate: '2026-07-01',

    durationValue: 6,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.INTERVIEW.value,

    tjm: 900,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.REMOTE.value,
    location: 'Paris',

    nextAction: {
      type: OPPORTUNITY_EVENT_TYPES.MEETING.value,
      label:
        'Organiser un atelier de cadrage technique avec le lead frontend et l’équipe architecture afin de préparer la migration Angular',
      dueDate: '2026-06-18',
    },

    events: [],

    notes: [],
  },
  {
    id: '7',

    companyName: 'Qonto',
    companyType: COMPANY_TYPES.STARTUP.value,
    industry: 'Finance',

    source: 'LinkedIn',

    contactName: 'Lucas Bernard',
    contactRole: 'CTO',
    contactEmail: 'lucas.bernard@qonto.com',

    missionTitle: 'Angular Lead',

    description: 'Mission Angular.',

    stack: ['Angular'],

    seniority: OPPORTUNITY_SENIORITIES.LEAD.value,

    estimatedStartDate: '2026-08-01',

    durationValue: 12,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.CONTACTED.value,

    tjm: 820,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.HYBRID.value,
    location: 'Paris',

    nextAction: null,

    events: [],

    notes: [],
  },
  {
    id: '8',

    companyName: 'Alan',
    companyType: COMPANY_TYPES.STARTUP.value,
    industry: 'Assurance',

    source: 'Réseau',

    contactName: 'Paul Martin',
    contactRole: 'VP Engineering',
    contactEmail: 'paul.martin@alan.com',

    missionTitle: 'Tech Lead',

    description: 'Mission Tech Lead.',

    stack: ['Angular'],

    seniority: OPPORTUNITY_SENIORITIES.LEAD.value,

    estimatedStartDate: '2026-06-01',

    durationValue: 12,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.WON.value,

    tjm: 900,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.REMOTE.value,
    location: 'Paris',

    nextAction: null,

    events: [],

    notes: [],
  },
  {
    id: '9',

    companyName: 'Back Market',
    companyType: COMPANY_TYPES.STARTUP.value,
    industry: 'E-commerce',

    source: 'LinkedIn',

    contactName: 'Claire Petit',
    contactRole: 'Engineering Manager',
    contactEmail: 'claire.petit@backmarket.com',

    missionTitle: 'Frontend Expert',

    description: 'Mission Frontend.',

    stack: ['Angular'],

    seniority: OPPORTUNITY_SENIORITIES.SENIOR.value,

    estimatedStartDate: '2026-06-15',

    durationValue: 9,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.LOST.value,

    tjm: 820,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.HYBRID.value,
    location: 'Paris',

    nextAction: null,

    events: [],

    notes: [],
  },
];

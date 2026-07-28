import { COMPANY_TYPES } from '../../../shared/constants/company.constants';
import { DURATION_UNITS } from '../../../shared/constants/duration.constants';
import { SENIORITIES } from '../../../shared/constants/seniority.constants';
import { WORK_MODALITIES } from '../../../shared/constants/work-modality.constants';
import { OPPORTUNITY_EVENT_TYPES, OPPORTUNITY_STATUSES } from '../constants/opportunity.constants';
import { Opportunity } from '../models/opportunity.model';

const today = new Date();

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

const addDays = (days: number): string => {
  const date = new Date(today);

  date.setDate(date.getDate() + days);

  return formatDate(date);
};

const addHours = (hours: number): string => {
  const date = new Date(today);

  date.setHours(date.getHours() + hours);

  return date.toISOString();
};

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',

    companyName: 'UBS',
    companyType: COMPANY_TYPES.CLIENT_FINAL.value,
    industry: 'Banque',

    source: 'LinkedIn',

    contactName: 'Sophie Meier',
    contactRole: 'Engineering Manager',
    contactEmail: 'sophie.meier@ubs.com',

    missionTitle: 'Migration Angular',

    description:
      "Migration d'une application Angular vers la dernière version avec modernisation de l'architecture.",

    stack: ['Angular', 'TypeScript', 'Nx', 'Jest'],

    seniority: SENIORITIES.SENIOR.value,

    estimatedStartDate: addDays(21),

    durationValue: 12,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.CONTACTED.value,

    tjm: 750,
    daysPerWeek: 5,

    modality: WORK_MODALITIES.HYBRID.value,
    location: 'Zürich',

    nextAction: {
      type: OPPORTUNITY_EVENT_TYPES.EMAIL.value,
      label: 'Relancer par email',
      dueDate: addDays(0),
    },

    events: [
      {
        id: 'event-1',

        type: OPPORTUNITY_EVENT_TYPES.CREATED.value,

        occurredAt: addHours(-48),
      },

      {
        id: 'event-2',

        type: OPPORTUNITY_EVENT_TYPES.STATUS_CHANGED.value,

        status: OPPORTUNITY_STATUSES.CONTACTED.value,

        occurredAt: addHours(-24),
      },
    ],

    notes: [
      {
        id: 'note-1',

        title: 'Premier échange',

        createdAt: addHours(-20),

        content:
          "Premier échange très positif avec l'Engineering Manager. Le besoin semble confirmé.",
      },
    ],
  },

  {
    id: '2',

    companyName: 'Swisscom',
    companyType: COMPANY_TYPES.CLIENT_FINAL.value,
    industry: 'Télécommunications',

    source: 'Malt',

    contactName: 'Thomas Keller',
    contactRole: 'Tech Recruiter',
    contactEmail: 'thomas.keller@swisscom.com',

    missionTitle: 'APIs Spring Boot',

    description: "Développement et maintenance d'APIs Spring Boot pour plusieurs équipes internes.",

    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],

    seniority: SENIORITIES.CONFIRMED.value,

    estimatedStartDate: addDays(30),

    durationValue: 6,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.CONTACTED.value,

    tjm: 820,
    daysPerWeek: 4,

    modality: WORK_MODALITIES.REMOTE.value,
    location: 'Berne',

    nextAction: {
      type: OPPORTUNITY_EVENT_TYPES.CALL.value,
      label: 'Appeler le recruteur',
      dueDate: addDays(-1),
    },

    events: [
      {
        id: 'event-3',

        type: OPPORTUNITY_EVENT_TYPES.CREATED.value,

        occurredAt: addHours(-72),
      },
    ],

    notes: [],
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

    description: "Participation à l'évolution de la plateforme frontend et du Design System.",

    stack: ['Angular', 'TypeScript', 'Storybook', 'Cypress'],

    seniority: SENIORITIES.SENIOR.value,

    estimatedStartDate: addDays(28),

    durationValue: 9,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.INTERVIEW.value,

    tjm: 850,
    daysPerWeek: 4,

    modality: WORK_MODALITIES.REMOTE.value,
    location: 'Paris',

    nextAction: {
      type: OPPORTUNITY_EVENT_TYPES.MEETING.value,
      label: "Préparer l'entretien technique",
      dueDate: addDays(1),
    },

    events: [
      {
        id: 'event-4',

        type: OPPORTUNITY_EVENT_TYPES.CREATED.value,

        occurredAt: addHours(-96),
      },

      {
        id: 'event-5',

        type: OPPORTUNITY_EVENT_TYPES.STATUS_CHANGED.value,

        status: OPPORTUNITY_STATUSES.INTERVIEW.value,

        occurredAt: addHours(-36),
      },
    ],

    notes: [
      {
        id: 'note-2',

        title: 'Entretien RH',

        createdAt: addHours(-30),

        content: "Très bon échange. Le prochain entretien sera technique avec l'équipe Frontend.",
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
      'Industrialisation du Design System Angular utilisé par plusieurs équipes produit.',

    stack: ['Angular', 'SCSS', 'Storybook', 'Nx'],

    seniority: SENIORITIES.LEAD.value,

    estimatedStartDate: addDays(35),

    durationValue: 18,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.PROPOSAL.value,

    tjm: 780,
    daysPerWeek: 5,

    modality: WORK_MODALITIES.HYBRID.value,
    location: 'Lyon',

    nextAction: {
      type: OPPORTUNITY_EVENT_TYPES.EMAIL.value,
      label: 'Finaliser la proposition commerciale',
      dueDate: addDays(3),
    },

    events: [
      {
        id: 'event-6',

        type: OPPORTUNITY_EVENT_TYPES.CREATED.value,

        occurredAt: addHours(-120),
      },

      {
        id: 'event-7',

        type: OPPORTUNITY_EVENT_TYPES.STATUS_CHANGED.value,

        status: OPPORTUNITY_STATUSES.PROPOSAL.value,

        occurredAt: addHours(-60),
      },
    ],

    notes: [
      {
        id: 'note-3',

        title: 'Proposition en cours',

        createdAt: addHours(-54),

        content: 'Le client attend une proposition détaillée avec le planning et les livrables.',
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

    description: "Accompagnement de l'équipe Platform sur les outils frontend.",

    stack: ['Angular', 'Nx', 'TypeScript'],

    seniority: SENIORITIES.SENIOR.value,

    estimatedStartDate: addDays(42),

    durationValue: 12,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.NEGOTIATION.value,

    tjm: 850,
    daysPerWeek: 5,

    modality: WORK_MODALITIES.HYBRID.value,
    location: 'Stockholm',

    nextAction: {
      type: OPPORTUNITY_EVENT_TYPES.CALL.value,
      label: 'Préparer la négociation du TJM',
      dueDate: addDays(6),
    },

    events: [
      {
        id: 'event-8',

        type: OPPORTUNITY_EVENT_TYPES.CREATED.value,

        occurredAt: addHours(-144),
      },

      {
        id: 'event-9',

        type: OPPORTUNITY_EVENT_TYPES.STATUS_CHANGED.value,

        status: OPPORTUNITY_STATUSES.NEGOTIATION.value,

        occurredAt: addHours(-72),
      },
    ],

    notes: [
      {
        id: 'note-4',

        title: 'Budget validé',

        createdAt: addHours(-66),

        content: 'Le budget est validé. Il reste uniquement à finaliser le TJM.',
      },
    ],
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

    description: "Participation à l'évolution de la plateforme frontend.",

    stack: ['Angular', 'TypeScript'],

    seniority: SENIORITIES.LEAD.value,

    estimatedStartDate: addDays(25),

    durationValue: 6,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.CONTACTED.value,

    tjm: 900,
    daysPerWeek: 5,

    modality: WORK_MODALITIES.REMOTE.value,
    location: 'Paris',

    nextAction: {
      type: OPPORTUNITY_EVENT_TYPES.EMAIL.value,
      label: 'Relancer si aucune réponse',
      dueDate: addDays(5),
    },

    events: [
      {
        id: 'event-10',

        type: OPPORTUNITY_EVENT_TYPES.CREATED.value,

        occurredAt: addHours(-168),
      },
    ],

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

    description: "Accompagnement des équipes frontend sur la refonte de l'application bancaire.",

    stack: ['Angular', 'TypeScript', 'Nx'],

    seniority: SENIORITIES.LEAD.value,

    estimatedStartDate: addDays(45),

    durationValue: 12,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.CONTACTED.value,

    tjm: 820,
    daysPerWeek: 5,

    modality: WORK_MODALITIES.HYBRID.value,
    location: 'Paris',

    nextAction: {
      type: OPPORTUNITY_EVENT_TYPES.EMAIL.value,
      label: 'Premier contact LinkedIn',
      dueDate: addDays(14),
    },

    events: [
      {
        id: 'event-11',

        type: OPPORTUNITY_EVENT_TYPES.CREATED.value,

        occurredAt: addHours(-192),
      },
    ],

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

    missionTitle: 'Tech Lead Frontend',

    description: 'Accompagnement de plusieurs équipes Angular sur la plateforme Design System.',

    stack: ['Angular', 'TypeScript', 'Storybook'],

    seniority: SENIORITIES.LEAD.value,

    estimatedStartDate: addDays(10),

    durationValue: 12,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.WON.value,

    tjm: 900,
    daysPerWeek: 5,

    modality: WORK_MODALITIES.REMOTE.value,
    location: 'Paris',

    nextAction: null,

    events: [
      {
        id: 'event-12',

        type: OPPORTUNITY_EVENT_TYPES.CREATED.value,

        occurredAt: addHours(-216),
      },

      {
        id: 'event-13',

        type: OPPORTUNITY_EVENT_TYPES.STATUS_CHANGED.value,

        status: OPPORTUNITY_STATUSES.WON.value,

        occurredAt: addHours(-24),
      },
    ],

    notes: [
      {
        id: 'note-5',

        title: 'Mission remportée',

        createdAt: addHours(-20),

        content: 'Contrat signé. Démarrage prévu dans une dizaine de jours.',
      },
    ],
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

    description: 'Évolution de la plateforme e-commerce et optimisation des performances.',

    stack: ['Angular', 'RxJS', 'TypeScript'],

    seniority: SENIORITIES.SENIOR.value,

    estimatedStartDate: addDays(30),

    durationValue: 9,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.LOST.value,

    tjm: 820,
    daysPerWeek: 5,

    modality: WORK_MODALITIES.HYBRID.value,
    location: 'Paris',

    nextAction: null,

    events: [
      {
        id: 'event-14',

        type: OPPORTUNITY_EVENT_TYPES.CREATED.value,

        occurredAt: addHours(-240),
      },

      {
        id: 'event-15',

        type: OPPORTUNITY_EVENT_TYPES.STATUS_CHANGED.value,

        status: OPPORTUNITY_STATUSES.LOST.value,

        occurredAt: addHours(-48),
      },
    ],

    notes: [
      {
        id: 'note-6',

        title: 'Retour client',

        createdAt: addHours(-44),

        content: 'Le client a finalement retenu un candidat interne pour cette mission.',
      },
    ],
  },
];

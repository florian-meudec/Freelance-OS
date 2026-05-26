import {
  COMPANY_TYPES,
  DURATION_UNITS,
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

    contactName: 'Sophie Meier',
    contactRole: 'Engineering Manager',
    contactEmail: 'sophie.meier@ubs.com',

    source: 'LinkedIn',

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

    nextAction: 'Premier contact LinkedIn',
    nextActionDate: '2026-05-20',
  },

  {
    id: '2',
    companyName: 'Swisscom',

    companyType: COMPANY_TYPES.CLIENT_FINAL.value,
    industry: 'Télécom',

    contactName: 'Thomas Keller',
    contactRole: 'Tech Recruiter',
    contactEmail: 'thomas.keller@swisscom.com',

    source: 'Malt',

    missionTitle: 'Spring Boot API',

    description: 'Création et maintenance d’APIs Spring Boot pour les services clients internes.',

    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],

    seniority: OPPORTUNITY_SENIORITIES.CONFIRMED.value,

    estimatedStartDate: '2026-07-01',

    durationValue: 6,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.CONTACTED.value,

    tjm: 820,
    workload: 4,

    modality: OPPORTUNITY_MODALITIES.REMOTE.value,
    location: 'Berne',

    nextAction: 'Relance email',
    nextActionDate: '2026-05-22',
  },

  {
    id: '3',
    companyName: 'Doctolib',

    companyType: COMPANY_TYPES.STARTUP.value,
    industry: 'Santé',

    contactName: 'Emma Laurent',
    contactRole: 'Talent Partner',
    contactEmail: 'emma.laurent@doctolib.com',

    source: 'LinkedIn',

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

    nextAction: 'Négociation budget',
    nextActionDate: '2026-05-21',
  },

  {
    id: '4',
    companyName: 'SNCF Connect',

    companyType: COMPANY_TYPES.CLIENT_FINAL.value,
    industry: 'Transport',

    contactName: 'Antoine Mercier',
    contactRole: 'Engineering Manager',
    contactEmail: 'antoine.mercier@sncf-connect.com',

    source: 'Meetup',

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

    nextAction: 'Entretien technique',
    nextActionDate: '2026-05-20',
  },

  {
    id: '5',
    companyName: 'Alan',

    companyType: COMPANY_TYPES.STARTUP.value,
    industry: 'Assurance santé',

    contactName: 'Lucas Martin',
    contactRole: 'Talent Partner',
    contactEmail: 'lucas.martin@alan.com',

    source: 'LinkedIn',

    missionTitle: 'Refonte espace admin',

    description:
      'Développement de nouvelles fonctionnalités pour l’espace d’administration interne.',

    stack: ['Angular', 'TypeScript', 'Node.js', 'Playwright'],

    seniority: OPPORTUNITY_SENIORITIES.CONFIRMED.value,

    estimatedStartDate: '2026-06-10',

    durationValue: 4,
    durationUnit: DURATION_UNITS.MONTHS.value,

    status: OPPORTUNITY_STATUSES.LEAD.value,

    tjm: 820,
    workload: 4,

    modality: OPPORTUNITY_MODALITIES.REMOTE.value,
    location: 'Paris',

    nextAction: 'Envoyer candidature',
    nextActionDate: '2026-05-21',
  },

  {
    id: '6',
    companyName: 'Orange',

    companyType: COMPANY_TYPES.ESN.value,
    industry: 'Télécom',

    contactName: 'Claire Bernard',
    contactRole: 'Business Manager',
    contactEmail: 'claire.bernard@orange.com',

    source: 'Email entrant',

    missionTitle: 'Angular Migration',

    description: 'Migration progressive d’un portail client AngularJS vers Angular moderne.',

    stack: ['Angular', 'RxJS', 'NgRx', 'Jasmine'],

    seniority: OPPORTUNITY_SENIORITIES.SENIOR.value,

    estimatedStartDate: '2026-07-15',

    durationValue: 220,
    durationUnit: DURATION_UNITS.DAYS.value,

    status: OPPORTUNITY_STATUSES.PROPOSAL.value,

    tjm: 720,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.HYBRID.value,
    location: 'Paris',

    nextAction: 'Envoyer proposition finale',
    nextActionDate: '2026-05-24',
  },
];

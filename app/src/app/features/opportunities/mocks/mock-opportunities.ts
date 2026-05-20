import { OPPORTUNITY_MODALITIES, OPPORTUNITY_STATUSES } from '../constants/opportunity.constants';
import { Opportunity } from '../models/opportunity.model';

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    companyName: 'UBS',
    missionTitle: 'Angular Migration',
    status: OPPORTUNITY_STATUSES.CONTACTED,

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
    missionTitle: 'Spring Boot API',
    status: OPPORTUNITY_STATUSES.CONTACTED,

    tjm: 820,
    workload: 4,

    modality: OPPORTUNITY_MODALITIES.REMOTE.value,
    location: 'Berne',

    nextAction: 'Relance email',
    nextActionDate: '2026-05-22',
  },

  {
    id: '3',
    companyName: 'Migros',
    missionTitle: 'Frontend Refactor',
    status: OPPORTUNITY_STATUSES.INTERVIEW,

    tjm: 700,
    workload: 3,

    modality: OPPORTUNITY_MODALITIES.ONSITE.value,
    location: 'Lausanne',

    nextAction: 'Préparer entretien technique',
    nextActionDate: '2026-05-21',
  },

  {
    id: '4',
    companyName: 'PostFinance',
    missionTitle: 'Internal Dashboard',
    status: OPPORTUNITY_STATUSES.PROPOSAL,

    tjm: 780,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.HYBRID.value,
    location: 'Berne',

    nextAction: 'Attendre retour client',
    nextActionDate: '2026-05-26',
  },

  {
    id: '5',
    companyName: 'Digitec',
    missionTitle: 'Angular Design System',
    status: OPPORTUNITY_STATUSES.NEGOTIATION,

    tjm: 850,
    workload: 4,

    modality: OPPORTUNITY_MODALITIES.REMOTE.value,
    location: 'Zürich',

    nextAction: 'Négocier TJM',
    nextActionDate: '2026-05-23',
  },

  {
    id: '6',
    companyName: 'AXA',
    missionTitle: 'Claims Management Tool',
    status: OPPORTUNITY_STATUSES.WON,

    tjm: 900,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.HYBRID.value,
    location: 'Winterthur',

    nextAction: 'Créer mission',
    nextActionDate: '2026-05-20',
  },

  {
    id: '7',
    companyName: 'Credit Suisse',
    missionTitle: 'Legacy Java Migration',
    status: OPPORTUNITY_STATUSES.LOST,

    tjm: 650,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.ONSITE.value,
    location: 'Zürich',

    nextAction: 'Archiver opportunité',
    nextActionDate: '2026-05-28',
  },
];

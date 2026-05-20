import { OPPORTUNITY_MODALITIES, OPPORTUNITY_STATUSES } from '../constants/opportunity.constants';
import { Opportunity } from '../models/opportunity.model';

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    companyName: 'UBS',
    missionTitle: 'Angular Migration',
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
    missionTitle: 'Spring Boot API',
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
    companyName: 'Migros',
    missionTitle: 'Frontend Refactor',
    status: OPPORTUNITY_STATUSES.INTERVIEW.value,

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
    status: OPPORTUNITY_STATUSES.PROPOSAL.value,

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
    status: OPPORTUNITY_STATUSES.NEGOTIATION.value,

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
    status: OPPORTUNITY_STATUSES.WON.value,

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
    status: OPPORTUNITY_STATUSES.LOST.value,

    tjm: 650,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.ONSITE.value,
    location: 'Zürich',

    nextAction: 'Archiver opportunité',
    nextActionDate: '2026-05-28',
  },
  {
    id: '8',
    companyName: 'Orange',
    missionTitle: 'Angular Migration',
    status: OPPORTUNITY_STATUSES.PROPOSAL.value,

    tjm: 720,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.HYBRID.value,
    location: 'Paris',

    nextAction: 'Envoyer proposition finale',
    nextActionDate: '2026-05-24',
  },

  {
    id: '9',
    companyName: 'Doctolib',
    missionTitle: 'Frontend Platform',
    status: OPPORTUNITY_STATUSES.NEGOTIATION.value,

    tjm: 850,
    workload: 4,

    modality: OPPORTUNITY_MODALITIES.REMOTE.value,
    location: 'Paris',

    nextAction: 'Négociation budget',
    nextActionDate: '2026-05-21',
  },

  {
    id: '10',
    companyName: 'SNCF Connect',
    missionTitle: 'Design System Angular',
    status: OPPORTUNITY_STATUSES.INTERVIEW.value,

    tjm: 780,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.HYBRID.value,
    location: 'Lyon',

    nextAction: 'Entretien technique',
    nextActionDate: '2026-05-20',
  },

  {
    id: '11',
    companyName: 'BlaBlaCar',
    missionTitle: 'Refonte Dashboard',
    status: OPPORTUNITY_STATUSES.WON.value,

    tjm: 900,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.REMOTE.value,
    location: 'Paris',

    nextAction: 'Préparer onboarding',
    nextActionDate: '2026-05-27',
  },

  {
    id: '12',
    companyName: 'OVHcloud',
    missionTitle: 'Migration Java 21',
    status: OPPORTUNITY_STATUSES.LOST.value,

    tjm: 700,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.ONSITE.value,
    location: 'Roubaix',

    nextAction: 'Archiver dossier',
    nextActionDate: '2026-05-29',
  },

  {
    id: '13',
    companyName: 'Qonto',
    missionTitle: 'Angular Admin Portal',
    status: OPPORTUNITY_STATUSES.CONTACTED.value,

    tjm: 800,
    workload: 4,

    modality: OPPORTUNITY_MODALITIES.REMOTE.value,
    location: 'Paris',

    nextAction: 'Relance recruteur',
    nextActionDate: '2026-05-22',
  },
  {
    id: '14',
    companyName: 'Back Market',
    missionTitle: 'Plateforme interne Angular',
    status: OPPORTUNITY_STATUSES.LEAD.value,

    tjm: 750,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.HYBRID.value,
    location: 'Paris',

    nextAction: 'Identifier contact tech',
    nextActionDate: '2026-05-25',
  },

  {
    id: '15',
    companyName: 'Alan',
    missionTitle: 'Refonte espace admin',
    status: OPPORTUNITY_STATUSES.LEAD.value,

    tjm: 820,
    workload: 4,

    modality: OPPORTUNITY_MODALITIES.REMOTE.value,
    location: 'Paris',

    nextAction: 'Envoyer candidature',
    nextActionDate: '2026-05-21',
  },

  {
    id: '16',
    companyName: 'Veepee',
    missionTitle: 'Migration Angular 19',
    status: OPPORTUNITY_STATUSES.LEAD.value,

    tjm: 700,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.ONSITE.value,
    location: 'Saint-Denis',

    nextAction: 'Analyser besoin client',
    nextActionDate: '2026-05-28',
  },
  {
    id: '17',
    companyName: 'Capgemini',
    missionTitle: 'Migration Angular Enterprise',
    status: OPPORTUNITY_STATUSES.LOST.value,

    tjm: 680,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.HYBRID.value,
    location: 'Paris',

    nextAction: 'Analyser retour client',
    nextActionDate: '2026-05-30',
  },

  {
    id: '18',
    companyName: 'Sopra Steria',
    missionTitle: 'Refonte portail RH',
    status: OPPORTUNITY_STATUSES.LOST.value,

    tjm: 650,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.ONSITE.value,
    location: 'Lyon',

    nextAction: 'Archiver opportunité',
    nextActionDate: '2026-05-27',
  },

  {
    id: '19',
    companyName: 'Airbus',
    missionTitle: 'Dashboard qualité',
    status: OPPORTUNITY_STATUSES.LOST.value,

    tjm: 750,
    workload: 4,

    modality: OPPORTUNITY_MODALITIES.HYBRID.value,
    location: 'Toulouse',

    nextAction: 'Documenter refus',
    nextActionDate: '2026-05-29',
  },

  {
    id: '20',
    companyName: 'BNP Paribas',
    missionTitle: 'Plateforme compliance',
    status: OPPORTUNITY_STATUSES.LOST.value,

    tjm: 720,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.ONSITE.value,
    location: 'Paris',

    nextAction: 'Archiver dossier',
    nextActionDate: '2026-05-31',
  },

  {
    id: '21',
    companyName: 'LVMH',
    missionTitle: 'Outils retail analytics',
    status: OPPORTUNITY_STATUSES.LOST.value,

    tjm: 830,
    workload: 4,

    modality: OPPORTUNITY_MODALITIES.HYBRID.value,
    location: 'Paris',

    nextAction: 'Noter feedback recrutement',
    nextActionDate: '2026-05-28',
  },

  {
    id: '22',
    companyName: 'Dassault Systèmes',
    missionTitle: 'Migration frontend legacy',
    status: OPPORTUNITY_STATUSES.LOST.value,

    tjm: 790,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.REMOTE.value,
    location: 'Vélizy-Villacoublay',

    nextAction: 'Archiver opportunité',
    nextActionDate: '2026-05-26',
  },

  {
    id: '23',
    companyName: 'Amadeus',
    missionTitle: 'Booking platform UI',
    status: OPPORTUNITY_STATUSES.LOST.value,

    tjm: 760,
    workload: 5,

    modality: OPPORTUNITY_MODALITIES.HYBRID.value,
    location: 'Nice',

    nextAction: 'Ajouter note interne',
    nextActionDate: '2026-05-30',
  },

  {
    id: '24',
    companyName: 'La Banque Postale',
    missionTitle: 'Application conseiller',
    status: OPPORTUNITY_STATUSES.LOST.value,

    tjm: 690,
    workload: 4,

    modality: OPPORTUNITY_MODALITIES.ONSITE.value,
    location: 'Paris',

    nextAction: 'Archiver dossier',
    nextActionDate: '2026-05-29',
  },
];

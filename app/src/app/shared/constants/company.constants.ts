/*
  Company classifications remain shared
  across opportunities, clients and missions.
*/
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

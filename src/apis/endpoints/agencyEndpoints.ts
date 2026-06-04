export const agencyEndpoints = {
  byId: (agencyId: string) => `/agency/${agencyId}`,
  logo: (agencyId: string) => `/agency/${agencyId}/logo`,
  legalDocument: (agencyId: string) => `/agency/${agencyId}/legal-document`,
} as const;

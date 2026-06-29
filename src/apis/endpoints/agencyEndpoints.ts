export const agencyEndpoints = {
  LIST: (params: { skip: number; limit: number }) =>
    `/agency/list?skip=${params.skip}&limit=${params.limit}`,
  OFFLINE_REGISTRATION: "/agency/offline-registration",
  INVITATIONS: "/agency/invitations",
  review: (agencyId: string) => `/agency/${agencyId}/review`,
  passwordLink: (agencyId: string) => `/agency/${agencyId}/password-link`,
  byId: (agencyId: string) => `/agency/${agencyId}`,
  logo: (agencyId: string) => `/agency/${agencyId}/logo`,
  legalDocument: (agencyId: string) => `/agency/${agencyId}/legal-document`,
} as const;

export const agencyEndpoints = {
  LIST: (params: { skip: number; limit: number }) =>
    `/agency/list?skip=${params.skip}&limit=${params.limit}`,
  byId: (agencyId: string) => `/agency/${agencyId}`,
  logo: (agencyId: string) => `/agency/${agencyId}/logo`,
  legalDocument: (agencyId: string) => `/agency/${agencyId}/legal-document`,
} as const;

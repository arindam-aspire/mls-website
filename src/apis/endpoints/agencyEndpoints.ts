export const agencyEndpoints = {
  LIST: (params: {
    skip: number;
    limit: number;
    search?: string;
    agencyStatus?: string;
    verificationStatus?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const searchParams = new URLSearchParams({
      skip: String(params.skip),
      limit: String(params.limit),
    });

    if (params.search) searchParams.set("search", params.search);
    if (params.agencyStatus) searchParams.set("agencyStatus", params.agencyStatus);
    if (params.verificationStatus) {
      searchParams.set("verificationStatus", params.verificationStatus);
    }
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    return `/agency/list?${searchParams.toString()}`;
  },
  OFFLINE_REGISTRATION: "/agency/offline-registration",
  INVITATIONS: "/agency/invitations",
  PASSWORD_SETUP: "/agency/password/setup",
  review: (agencyId: string) => `/agency/${agencyId}/review`,
  activation: (agencyId: string) => `/agency/${agencyId}/activation`,
  passwordLink: (agencyId: string) => `/agency/${agencyId}/password-link`,
  byId: (agencyId: string) => `/agency/${agencyId}`,
  logo: (agencyId: string) => `/agency/${agencyId}/logo`,
  legalDocument: (agencyId: string) => `/agency/${agencyId}/legal-document`,
} as const;

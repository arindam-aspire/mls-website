export type AgencySignUpRequest = {
  agency_name: string;
  agency_trade_name: string;
  email: string;
  phone_number: string;
  password: string;
  legal_document: File;
};

export type AgencySignUpResponse = {
  success: boolean;
  message: string;
  data: unknown;
  error: unknown;
  meta: Record<string, unknown>;
};

export type AgencySignUpSubmitValues = {
  agencyName: string;
  tradeName: string;
  email: string;
  phone: string;
  password: string;
  legalDocument: File;
};

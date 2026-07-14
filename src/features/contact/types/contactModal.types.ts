export const CONTACT_MODAL_MODES = ["email", "whatsapp", "call"] as const;

export type ContactModalMode = (typeof CONTACT_MODAL_MODES)[number];

/** Dynamic recipient + property/lead context for ContactModal. */
export type ContactModalContext = {
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  /** WhatsApp number when different from phone; falls back to recipientPhone. */
  recipientWhatsApp?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  propertyTitle: string;
  /** Property reference number or lead number. */
  propertyReference: string;
  /** Optional override for the message body template result. */
  defaultMessage?: string;
};

export type ContactModalFormValues = {
  name: string;
  email: string;
  /** Full phone for message body (`+962 7…`). */
  phone: string;
  phoneCountryCode: string;
  phoneNationalNumber: string;
  message: string;
  keepInformed: boolean;
};

export type ContactModalOpenParams = {
  mode: ContactModalMode;
  context: ContactModalContext;
};

export type ContactModalLabels = {
  emailTitle: string;
  whatsappTitle: string;
  callTitle: string;
  toLabel: string;
  sentToLabel: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  phonePlaceholder: string;
  phoneSearchPlaceholder: string;
  phoneEmptySearchLabel: string;
  messageLabel: string;
  keepInformedLabel: string;
  agencyNameLabel: string;
  phoneNumberLabel: string;
  propertyLabel: string;
  sendLabel: string;
  cancelLabel: string;
  callConfirmTitle: string;
  callConfirmDescription: string;
  callConfirmLabel: string;
  callCancelLabel: string;
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  messageRequired: string;
  missingRecipientEmail: string;
  missingRecipientPhone: string;
  sendErrorTitle: string;
};

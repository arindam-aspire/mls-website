import type { LoggedInUser } from "@/src/features/auth/types/user.types";
import type { Lead } from "@/src/features/leads/types/lead.types";
import type { ContactModalContext } from "../types/contactModal.types";
import { buildDefaultInquiryMessage } from "../utils/contactMessage.utils";
import {
  resolveLeadCustomerName,
  resolveLeadPropertyTitle,
} from "@/src/features/leads/utils/leadDisplay.utils";

export function mapLeadToContactContext(params: {
  lead: Lead;
  user: LoggedInUser | null | undefined;
  buildMessage: (propertyTitle: string, propertyReference: string) => string;
}): ContactModalContext {
  const { lead, user, buildMessage } = params;
  const propertyTitle = resolveLeadPropertyTitle(lead);
  const propertyReference = lead.lead_number?.trim() || lead.id;

  return {
    recipientName: resolveLeadCustomerName(lead),
    recipientEmail: lead.contact_email?.trim() || "",
    recipientPhone: lead.contact_phone?.trim() || "",
    recipientWhatsApp: lead.contact_phone?.trim() || "",
    customerName: user?.full_name?.trim() || "",
    customerEmail: user?.email?.trim() || "",
    customerPhone: user?.phone_number?.trim() || "",
    propertyTitle,
    propertyReference,
    defaultMessage: buildDefaultInquiryMessage({
      propertyTitle,
      propertyReference,
      buildMessage,
    }),
  };
}

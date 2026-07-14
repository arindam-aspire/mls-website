import type { ContactModalContext } from "../types/contactModal.types";

export function buildDefaultInquiryMessage({
  propertyTitle,
  propertyReference,
  buildMessage,
}: {
  propertyTitle: string;
  propertyReference: string;
  buildMessage: (propertyTitle: string, propertyReference: string) => string;
}): string {
  return buildMessage(propertyTitle || "—", propertyReference || "—");
}

export function resolveWhatsAppPhone(context: ContactModalContext): string {
  return (
    context.recipientWhatsApp?.trim() ||
    context.recipientPhone?.trim() ||
    ""
  );
}

export function buildWhatsAppShareText(params: {
  message: string;
  name: string;
  email: string;
  phone: string;
  propertyTitle: string;
  propertyReference: string;
}): string {
  const lines = [
    params.message.trim(),
    "",
    params.name.trim() ? `Name: ${params.name.trim()}` : null,
    params.email.trim() ? `Email: ${params.email.trim()}` : null,
    params.phone.trim() ? `Phone: ${params.phone.trim()}` : null,
    params.propertyTitle.trim()
      ? `Property: ${params.propertyTitle.trim()}`
      : null,
    params.propertyReference.trim()
      ? `Ref: #${params.propertyReference.trim()}`
      : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export function buildMailtoHref(params: {
  to: string;
  subject: string;
  body: string;
}): string {
  const search = new URLSearchParams();
  search.set("subject", params.subject);
  search.set("body", params.body);
  return `mailto:${params.to}?${search.toString()}`;
}

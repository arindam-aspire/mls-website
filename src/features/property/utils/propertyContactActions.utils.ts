import { tokenStore } from "@/src/apis/core/token.store";
import { AUTH_VIEW } from "@/src/features/auth/authViews";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import type {
  PropertyDetails,
  PropertyAgentContactAction,
  PropertyDetailsAgent,
} from "../types/property.types";
import { resolvePropertyViewOwners } from "../mappers/mapPropertyDetailsForPropertyView";

type ContactPerson = {
  email?: string;
  phone?: string;
  whatsapp?: string;
  actions?: PropertyAgentContactAction[];
  contact_actions?: PropertyDetailsAgent["contact_actions"];
};

function isAuthenticated(): boolean {
  const { user, isLoadingUser } = useAuthStore.getState();
  const hasAccessToken = Boolean(tokenStore.getAccessToken());

  return Boolean(user) || (hasAccessToken && isLoadingUser);
}

function openLogin(): void {
  useAuthStore.getState().openAuth(AUTH_VIEW.chooseAccount);
}

function resolveContactAction(
  contact: ContactPerson | undefined,
  type: PropertyAgentContactAction["type"],
): PropertyAgentContactAction | undefined {
  const fromList = contact?.actions?.find((action) => action.type === type);
  if (fromList) {
    return fromList;
  }

  return contact?.contact_actions?.[type];
}

function shouldOpenLoginForAgentContactAction(
  contact: ContactPerson | undefined,
  type: PropertyAgentContactAction["type"],
): boolean {
  if (isAuthenticated()) {
    return false;
  }

  const action = resolveContactAction(contact, type);
  return action != null && !action.enabled;
}

function openAgentContactAction(
  propertyDetails: PropertyDetails | null | undefined,
  type: PropertyAgentContactAction["type"],
  openContact: (contact: ContactPerson | undefined) => void,
) {
  const contact = resolvePropertyDetailsAgent(propertyDetails);

  if (shouldOpenLoginForAgentContactAction(contact, type)) {
    openLogin();
    return;
  }

  openContact(contact);
}

function normalizePhoneForTel(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

function normalizePhoneForWhatsApp(phone: string): string {
  return phone.replace(/\D/g, "");
}

function resolveContactActionHref(
  contact: ContactPerson | undefined,
  type: PropertyAgentContactAction["type"],
): string | null {
  const fromList = contact?.actions?.find(
    (action) => action.type === type && action.enabled && action.href,
  )?.href;
  if (fromList) {
    return fromList;
  }

  const fromMap = contact?.contact_actions?.[type];
  if (fromMap?.enabled && fromMap.href) {
    return fromMap.href;
  }

  return null;
}

function openEmailAddress(email: string) {
  window.location.href = `mailto:${email}`;
}

function openPhoneNumber(phone: string) {
  const normalized = normalizePhoneForTel(phone);
  if (!normalized) {
    return;
  }

  window.location.href = `tel:${normalized}`;
}

function openWhatsAppNumber(phone: string) {
  const normalized = normalizePhoneForWhatsApp(phone);
  if (!normalized) {
    return;
  }

  window.open(`https://wa.me/${normalized}`, "_blank", "noopener,noreferrer");
}

function openContactEmail(contact: ContactPerson | undefined) {
  const href = resolveContactActionHref(contact, "email");
  if (href) {
    window.location.href = href;
    return;
  }

  const email = contact?.email?.trim();
  if (!email) {
    return;
  }

  openEmailAddress(email);
}

function openContactPhone(contact: ContactPerson | undefined) {
  const href = resolveContactActionHref(contact, "phone");
  if (href) {
    window.location.href = href;
    return;
  }

  const phone = contact?.phone?.trim();
  if (!phone) {
    return;
  }

  openPhoneNumber(phone);
}

function openContactWhatsApp(contact: ContactPerson | undefined) {
  const href = resolveContactActionHref(contact, "whatsapp");
  if (href) {
    window.open(href, "_blank", "noopener,noreferrer");
    return;
  }

  const whatsapp = contact?.whatsapp?.trim() || contact?.phone?.trim();
  if (!whatsapp) {
    return;
  }

  openWhatsAppNumber(whatsapp);
}

export function resolvePropertyDetailsAgent(
  propertyDetails: PropertyDetails | null | undefined,
): ContactPerson | undefined {
  const agent = propertyDetails?.agent;
  if (!agent) {
    return undefined;
  }

  return {
    email: agent.email,
    phone: agent.phone,
    whatsapp: agent.whatsapp,
    actions: agent.actions,
    contact_actions: agent.contact_actions,
  };
}

export function resolvePropertyDetailsOwner(
  propertyDetails: PropertyDetails | null | undefined,
  ownerId?: number,
): ContactPerson | undefined {
  const owners = resolvePropertyViewOwners(propertyDetails);
  if (owners.length === 0) {
    return undefined;
  }

  const owner =
    ownerId == null
      ? owners[0]
      : owners.find((entry) => entry.id === ownerId) ?? owners[0];

  return {
    email: owner.email,
    phone: owner.phone,
    whatsapp: owner.phone,
  };
}

export function openPropertyAgentEmail(
  propertyDetails: PropertyDetails | null | undefined,
) {
  openAgentContactAction(propertyDetails, "email", openContactEmail);
}

export function openPropertyAgentPhone(
  propertyDetails: PropertyDetails | null | undefined,
) {
  openAgentContactAction(propertyDetails, "phone", openContactPhone);
}

export function openPropertyAgentWhatsApp(
  propertyDetails: PropertyDetails | null | undefined,
) {
  openAgentContactAction(propertyDetails, "whatsapp", openContactWhatsApp);
}

export function openPropertyOwnerEmail(
  propertyDetails: PropertyDetails | null | undefined,
  ownerId?: number,
) {
  openContactEmail(resolvePropertyDetailsOwner(propertyDetails, ownerId));
}

export function openPropertyOwnerPhone(
  propertyDetails: PropertyDetails | null | undefined,
  ownerId?: number,
) {
  openContactPhone(resolvePropertyDetailsOwner(propertyDetails, ownerId));
}

export function openPropertyOwnerWhatsApp(
  propertyDetails: PropertyDetails | null | undefined,
  ownerId?: number,
) {
  openContactWhatsApp(resolvePropertyDetailsOwner(propertyDetails, ownerId));
}

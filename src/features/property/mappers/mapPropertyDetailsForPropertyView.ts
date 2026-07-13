import type { PropertyDetails, PropertyOwner, PropertyDetailsAgent } from "../types/property.types";

type LibraryPropertyOwner = NonNullable<PropertyDetails["owner"]>;
type LibraryPropertyAgent = PropertyDetailsAgent;

function hasOwnerContactDetails(owner: PropertyOwner): boolean {
  return Boolean(
    owner.full_name?.trim() ||
      owner.email?.trim() ||
      owner.phone?.trim() ||
      owner.address?.trim(),
  );
}

function mapApiOwnerToLibraryOwner(
  owner: PropertyOwner,
  index: number,
): LibraryPropertyOwner {
  const parsedId = Number(owner.owner_id);

  return {
    id: Number.isFinite(parsedId) ? parsedId : index + 1,
    name: owner.full_name?.trim() || `Owner ${index + 1}`,
    phone: owner.phone?.trim() || "",
    email: owner.email?.trim() || "",
    is_private: owner.is_active === false,
  };
}

function normalizeLibraryOwner(owner: LibraryPropertyOwner): LibraryPropertyOwner {
  return {
    id: owner.id,
    name: owner.name?.trim() || "",
    phone: owner.phone?.trim() || "",
    email: owner.email?.trim() || "",
    is_private: owner.is_private,
  };
}

function isVisibleLibraryOwner(owner: LibraryPropertyOwner): boolean {
  return Boolean(
    owner.name?.trim() ||
      owner.email?.trim() ||
      owner.phone?.trim(),
  );
}

export function resolvePropertyViewOwners(
  propertyDetails: PropertyDetails | null | undefined,
): LibraryPropertyOwner[] {
  if (!propertyDetails) {
    return [];
  }

  const ownersFromApi = (propertyDetails.owners ?? [])
    .filter(hasOwnerContactDetails)
    .map(mapApiOwnerToLibraryOwner)
    .map(normalizeLibraryOwner)
    .filter(isVisibleLibraryOwner);

  if (ownersFromApi.length > 0) {
    return ownersFromApi;
  }

  return [];
}

function normalizeLibraryAgent(agent: LibraryPropertyAgent): LibraryPropertyAgent {
  const phone = agent.phone?.trim() || "";
  const whatsappAction = agent.contact_actions?.whatsapp ?? agent.actions?.find((action) => action.type === "whatsapp");
  const whatsappFromAction = whatsappAction?.enabled ? whatsappAction.href?.replace(/^https:\/\/wa\.me\//, "") : "";

  return {
    id: agent.id,
    name: agent.name?.trim() || "",
    phone,
    whatsapp: agent.whatsapp?.trim() || whatsappFromAction || phone,
    email: agent.email?.trim() || "",
    photo: agent.photo ?? null,
    license_number: agent.license_number ?? null,
    phone_country_code: agent.phone_country_code,
    contact_actions: agent.contact_actions,
    actions: agent.actions,
  };
}

function isVisibleLibraryAgent(agent: LibraryPropertyAgent): boolean {
  return Boolean(
    agent.name?.trim() ||
      agent.email?.trim() ||
      agent.phone?.trim(),
  );
}

function mapFlatApiFieldsToLibraryAgent(
  propertyDetails: PropertyDetails,
): LibraryPropertyAgent | null {
  const agentName = propertyDetails.agent_name?.trim();
  const agentEmail = propertyDetails.agent_email?.trim();
  const agentPhone = propertyDetails.agent_phone?.trim();

  if (!agentName && !agentEmail && !agentPhone) {
    return null;
  }

  const parsedId = Number(
    propertyDetails.agent_user_id ?? propertyDetails.assigned_agent_id,
  );

  return normalizeLibraryAgent({
    id: Number.isFinite(parsedId) ? parsedId : 0,
    name: agentName || agentEmail || agentPhone || "",
    phone: agentPhone || "",
    whatsapp: agentPhone || "",
    email: agentEmail || "",
    photo: null,
    license_number: null,
  });
}

export function resolvePropertyViewAgent(
  propertyDetails: PropertyDetails | null | undefined,
): LibraryPropertyAgent | null {
  if (!propertyDetails) {
    return null;
  }

  if (propertyDetails.agent === null) {
    return null;
  }

  const agentFromDetails = propertyDetails.agent;
  if (agentFromDetails) {
    const normalized = normalizeLibraryAgent({
      ...agentFromDetails,
      name: agentFromDetails.name ?? "",
      phone: agentFromDetails.phone ?? "",
      whatsapp: agentFromDetails.whatsapp ?? agentFromDetails.phone ?? "",
      email: agentFromDetails.email ?? "",
    });

    if (isVisibleLibraryAgent(normalized)) {
      return normalized;
    }

    return null;
  }

  return mapFlatApiFieldsToLibraryAgent(propertyDetails);
}

function formatHandoverForPropertyView(
  handover: string | null | undefined,
): string | null {
  const trimmed = handover?.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function mapPropertyDetailsForPropertyView<T extends PropertyDetails>(
  propertyDetails: T,
): T {
  const handover = formatHandoverForPropertyView(propertyDetails.handover);
  const agent = resolvePropertyViewAgent(propertyDetails);
  const viewOwners = resolvePropertyViewOwners(propertyDetails);
  const withMappedFields = {
    ...propertyDetails,
    handover,
    agent,
  };

  if (viewOwners.length === 0) {
    return {
      ...withMappedFields,
      owners: [] as T["owners"],
      owner: null,
    };
  }

  if (viewOwners.length === 1) {
    return {
      ...withMappedFields,
      owners: viewOwners as T["owners"],
      owner: null,
    };
  }

  return {
    ...withMappedFields,
    owners: viewOwners as T["owners"],
    owner: null,
  };
}

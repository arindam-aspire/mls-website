"use client";

import type { PropertyListing } from "@/src/features/property/types/property.types";
import { useLocale } from "next-intl";
import { useCallback } from "react";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import type { PropertyDetails } from "@/src/features/property/types/property.types";
import {
  ensureListingAgentContactAllowed,
  ensurePropertyAgentContactAllowed,
  launchEmailTo,
  launchWhatsAppChat,
} from "@/src/features/property/utils/propertyContactActions.utils";
import { useContactModal } from "./useContactModal";
import {
  mapListingToContactContext,
  mapPropertyDetailsAgentToContactContext,
  mapPropertyDetailsOwnerToContactContext,
  type ContactPropertyListingSource,
} from "../mappers/mapContactModalContext";

/**
 * Shared contact-modal actions for property list cards and property details.
 */
export function usePropertyContactModalActions() {
  const contactModal = useContactModal();
  const { openContact, buildDefaultMessage } = contactModal;
  const user = useAuthStore((state) => state.user);
  const locale = useLocale();

  const onClickEmail = useCallback(
    (listing: PropertyListing) => {
      if (!ensureListingAgentContactAllowed(listing)) {
        return;
      }
      const context = mapListingToContactContext({
        listing: listing as unknown as ContactPropertyListingSource,
        user,
        locale,
        buildMessage: buildDefaultMessage,
      });
      const email = context.recipientEmail.trim();
      if (!email) {
        openContact({ mode: "email", context });
        return;
      }
      launchEmailTo(email);
    },
    [buildDefaultMessage, locale, openContact, user],
  );

  const onClickCall = useCallback(
    (listing: PropertyListing) => {
      if (!ensureListingAgentContactAllowed(listing)) {
        return;
      }
      openContact({
        mode: "call",
        context: mapListingToContactContext({
          listing: listing as unknown as ContactPropertyListingSource,
          user,
          locale,
          buildMessage: buildDefaultMessage,
        }),
      });
    },
    [buildDefaultMessage, locale, openContact, user],
  );

  const onClickWhatsApp = useCallback(
    (listing: PropertyListing) => {
      if (!ensureListingAgentContactAllowed(listing)) {
        return;
      }
      const context = mapListingToContactContext({
        listing: listing as unknown as ContactPropertyListingSource,
        user,
        locale,
        buildMessage: buildDefaultMessage,
      });
      const phone =
        context.recipientWhatsApp?.trim() || context.recipientPhone.trim();
      if (!phone) {
        openContact({ mode: "whatsapp", context });
        return;
      }
      launchWhatsAppChat(phone);
    },
    [buildDefaultMessage, locale, openContact, user],
  );

  const openAgentEmail = useCallback(
    (propertyDetails: PropertyDetails | null | undefined) => {
      if (!ensurePropertyAgentContactAllowed(propertyDetails, "email")) {
        return;
      }
      const context = mapPropertyDetailsAgentToContactContext({
        propertyDetails,
        user,
        locale,
        buildMessage: buildDefaultMessage,
      });
      if (!context) return;
      openContact({ mode: "email", context });
    },
    [buildDefaultMessage, locale, openContact, user],
  );

  const openAgentPhone = useCallback(
    (propertyDetails: PropertyDetails | null | undefined) => {
      if (!ensurePropertyAgentContactAllowed(propertyDetails, "phone")) {
        return;
      }
      const context = mapPropertyDetailsAgentToContactContext({
        propertyDetails,
        user,
        locale,
        buildMessage: buildDefaultMessage,
      });
      if (!context) return;
      openContact({ mode: "call", context });
    },
    [buildDefaultMessage, locale, openContact, user],
  );

  const openAgentWhatsApp = useCallback(
    (propertyDetails: PropertyDetails | null | undefined) => {
      if (!ensurePropertyAgentContactAllowed(propertyDetails, "whatsapp")) {
        return;
      }
      const context = mapPropertyDetailsAgentToContactContext({
        propertyDetails,
        user,
        locale,
        buildMessage: buildDefaultMessage,
      });
      if (!context) return;
      openContact({ mode: "whatsapp", context });
    },
    [buildDefaultMessage, locale, openContact, user],
  );

  const openOwnerEmail = useCallback(
    (propertyDetails: PropertyDetails | null | undefined, ownerId?: number) => {
      const context = mapPropertyDetailsOwnerToContactContext({
        propertyDetails,
        ownerId,
        user,
        locale,
        buildMessage: buildDefaultMessage,
      });
      if (!context) return;
      openContact({ mode: "email", context });
    },
    [buildDefaultMessage, locale, openContact, user],
  );

  const openOwnerPhone = useCallback(
    (propertyDetails: PropertyDetails | null | undefined, ownerId?: number) => {
      const context = mapPropertyDetailsOwnerToContactContext({
        propertyDetails,
        ownerId,
        user,
        locale,
        buildMessage: buildDefaultMessage,
      });
      if (!context) return;
      openContact({ mode: "call", context });
    },
    [buildDefaultMessage, locale, openContact, user],
  );

  const openOwnerWhatsApp = useCallback(
    (propertyDetails: PropertyDetails | null | undefined, ownerId?: number) => {
      const context = mapPropertyDetailsOwnerToContactContext({
        propertyDetails,
        ownerId,
        user,
        locale,
        buildMessage: buildDefaultMessage,
      });
      if (!context) return;
      openContact({ mode: "whatsapp", context });
    },
    [buildDefaultMessage, locale, openContact, user],
  );

  return {
    contactModal,
    onClickEmail,
    onClickCall,
    onClickWhatsApp,
    openAgentEmail,
    openAgentPhone,
    openAgentWhatsApp,
    openOwnerEmail,
    openOwnerPhone,
    openOwnerWhatsApp,
  };
}

"use client";

import { formatPhoneNumberE164 } from "@/src/features/profile/utils/formatPhoneNumberE164";
import { getPhoneInputCountryByCode } from "@/src/components/ui/phone-input/countries";
import { useToast } from "@/src/hooks/useToast";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInviteAgentByEmail } from "../mutations/agent.mutation";
import type { AgentInviteResult } from "../types/agent.types";
import {
  mapAgentInviteMutationFieldErrors,
  resolveBackendApiMessage,
} from "../utils/agentOnboardingErrors.utils";
import { validateInviteContactValue } from "../utils/validateOnboardAgentForms";
import type { InviteAgentContactMethod } from "../components/InviteAgentContactForm";
import type { ApiError } from "@/src/apis/core/error.normalizer";

type InviteFormErrors = {
  email?: string;
  phone?: string;
  contact?: string;
};

const EMPTY_INVITE_FORM_ERRORS: InviteFormErrors = {};

export function useInviteAgentByEmailModal() {
  const t = useTranslations("user.agents.inviteByEmailModal");
  const tAuth = useTranslations("auth");
  const tErrors = useTranslations("user.agents.errors");
  const toast = useToast();
  const { mutateAsync: inviteAgent, reset: resetInviteMutation, isPending: isGenerating } =
    useInviteAgentByEmail();

  const [isOpen, setIsOpen] = useState(false);
  const [contactMethod, setContactMethod] = useState<InviteAgentContactMethod>("email");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("JO");
  const [phoneNationalNumber, setPhoneNationalNumber] = useState("");
  const [errors, setErrors] = useState<InviteFormErrors>(EMPTY_INVITE_FORM_ERRORS);
  const [inviteResult, setInviteResult] = useState<AgentInviteResult | null>(null);

  const hasGeneratedInvite = inviteResult !== null;
  const generateInFlightRef = useRef(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const wasOpenRef = useRef(false);

  const closeModal = useCallback(() => {
    if (isGenerating || generateInFlightRef.current) {
      return;
    }

    setIsOpen(false);
  }, [isGenerating]);

  const resolveEmailErrorMessage = useCallback(
    (error: "required" | "invalid" | null) => {
      if (error === "required") {
        return tAuth("signUpEmailRequired");
      }

      if (error === "invalid") {
        return tAuth("signUpEmailInvalid");
      }

      return undefined;
    },
    [tAuth],
  );

  const onContactMethodChange = useCallback(
    (method: InviteAgentContactMethod) => {
      if (hasGeneratedInvite) {
        return;
      }

      setContactMethod(method);
      setErrors(EMPTY_INVITE_FORM_ERRORS);
    },
    [hasGeneratedInvite],
  );

  const onEmailChange = useCallback(
    (value: string) => {
      if (hasGeneratedInvite) {
        return;
      }

      setEmail(value);
      setErrors(EMPTY_INVITE_FORM_ERRORS);
    },
    [hasGeneratedInvite],
  );

  const onPhoneCountryChange = useCallback(
    (value: string) => {
      if (hasGeneratedInvite) {
        return;
      }

      setPhoneCountryCode(value);
      setErrors(EMPTY_INVITE_FORM_ERRORS);
    },
    [hasGeneratedInvite],
  );

  const onPhoneNationalNumberChange = useCallback(
    (value: string) => {
      if (hasGeneratedInvite) {
        return;
      }

      setPhoneNationalNumber(value);
      setErrors(EMPTY_INVITE_FORM_ERRORS);
    },
    [hasGeneratedInvite],
  );

  const onGenerateInvite = useCallback(async () => {
    if (isGenerating || generateInFlightRef.current || hasGeneratedInvite) {
      return;
    }

    const country = getPhoneInputCountryByCode(phoneCountryCode);
    const e164Phone = country
      ? formatPhoneNumberE164(country.dialCode, phoneNationalNumber)
      : "";

    const contactError = validateInviteContactValue({
      contactMethod,
      email,
      phoneNationalNumber,
      e164Phone,
    });

    if (contactError) {
      if (contactMethod === "email") {
        setErrors({
          email: resolveEmailErrorMessage(contactError),
        });
      } else {
        setErrors({
          phone:
            contactError === "required"
              ? tAuth("signUpPhoneRequired")
              : tAuth("signUpPhoneInvalid"),
        });
      }
      return;
    }

    setErrors(EMPTY_INVITE_FORM_ERRORS);
    generateInFlightRef.current = true;

    try {
      const result = await inviteAgent(
        contactMethod === "email"
          ? { email: email.trim() }
          : { phone: e164Phone },
      );
      setInviteResult(result);

      const successMessage = result.message?.trim();
      if (successMessage) {
        toast.success(successMessage);
      } else {
        toast.success(t("generated.readyTitle"));
      }
    } catch (error) {
      const apiError = error as ApiError;
      const fieldErrors = mapAgentInviteMutationFieldErrors(apiError, {
        duplicateEmail: tErrors("duplicateEmail"),
        duplicatePhone: tErrors("duplicatePhone"),
      });

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      }

      toast.error(t("errorTitle"), {
        description: resolveBackendApiMessage(error, tErrors("generic")),
      });
    } finally {
      generateInFlightRef.current = false;
    }
  }, [
    contactMethod,
    email,
    hasGeneratedInvite,
    inviteAgent,
    isGenerating,
    phoneCountryCode,
    phoneNationalNumber,
    resolveEmailErrorMessage,
    t,
    tAuth,
    tErrors,
    toast,
  ]);

  const onCopyLink = useCallback(async () => {
    const inviteLink = inviteResult?.invite.inviteLink;

    if (!inviteLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success(t("generated.copyLinkSuccessTitle"), {
        description: t("generated.copyLinkSuccessDescription"),
      });
    } catch {
      toast.error(t("generated.copyLinkErrorTitle"), {
        description: t("generated.copyLinkErrorDescription"),
      });
    }
  }, [inviteResult?.invite.inviteLink, t, toast]);

  const onSendViaEmail = useCallback(() => {
    if (!inviteResult) {
      return;
    }

    const subject = encodeURIComponent(t("generated.emailSubject"));
    const body = encodeURIComponent(
      t("generated.emailBody", { link: inviteResult.invite.inviteLink }),
    );
    const mailtoTarget = inviteResult.invite.email || email.trim();
    const mailtoUrl = `mailto:${encodeURIComponent(mailtoTarget)}?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;
  }, [email, inviteResult, t]);

  const onPrimaryAction = useCallback(() => {
    if (hasGeneratedInvite) {
      onSendViaEmail();
      return;
    }

    void onGenerateInvite();
  }, [hasGeneratedInvite, onGenerateInvite, onSendViaEmail]);

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      setContactMethod("email");
      setEmail("");
      setPhoneCountryCode("JO");
      setPhoneNationalNumber("");
      setErrors(EMPTY_INVITE_FORM_ERRORS);
      setInviteResult(null);
      generateInFlightRef.current = false;
      resetInviteMutation();
    }

    wasOpenRef.current = isOpen;
  }, [isOpen, resetInviteMutation]);

  const generatedMessage = hasGeneratedInvite
    ? t("generated.descriptionWithContact", {
        contact: inviteResult?.invite.email || email.trim() || phoneNationalNumber.trim(),
      })
    : undefined;

  return {
    isOpen,
    openModal,
    closeModal,
    title: t("title"),
    description: hasGeneratedInvite
      ? t("generated.subtitle")
      : t("description"),
    cancelLabel: hasGeneratedInvite
      ? t("generated.done")
      : t("cancel"),
    primaryActionLabel: hasGeneratedInvite
      ? t("generated.sendViaEmail")
      : t("generate"),
    generatingLabel: t("generating"),
    isGenerating,
    hasGeneratedInvite,
    onPrimaryAction,
    content: {
      contactMethod,
      email,
      phoneCountryCode,
      phoneNationalNumber,
      contactMethodEmailLabel: t("contactMethodEmail"),
      contactMethodPhoneLabel: t("contactMethodPhone"),
      emailLabel: t("emailLabel"),
      emailPlaceholder: t("emailPlaceholder"),
      phoneLabel: t("phoneLabel"),
      phonePlaceholder: tAuth("signUpPhonePlaceholder"),
      phoneSearchPlaceholder: tAuth("signUpPhoneSearchPlaceholder"),
      phoneEmptySearchLabel: tAuth("signUpPhoneNoMatches"),
      emailError: errors.email,
      phoneError: errors.phone,
      contactError: errors.contact,
      isContactDisabled: isGenerating || hasGeneratedInvite,
      onContactMethodChange,
      onEmailChange,
      onPhoneCountryChange,
      onPhoneNationalNumberChange,
      isGenerating,
      generatingMessage: t("generating"),
      generatingHint: t("generatingHint"),
      hasGeneratedInvite,
      readyTitle: t("generated.readyTitle"),
      generatedMessage: generatedMessage ?? "",
      shareHint: t("generated.shareHint"),
      linkLabel: t("generated.linkLabel"),
      inviteLink: inviteResult?.invite.inviteLink ?? "",
      copyLinkLabel: t("generated.copyLink"),
      onCopyLink,
    },
  };
}

export type UseInviteAgentByEmailModalReturn = ReturnType<
  typeof useInviteAgentByEmailModal
>;

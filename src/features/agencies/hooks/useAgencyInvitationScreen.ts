"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/src/hooks/useToast";
import { useRouter } from "@/src/i18n/navigation";
import type { AgencyInvitationPreview } from "@/src/features/profile/types/profile.types";
import {
  acceptAgencyInvitation,
  uploadAgencyInvitationLegalDocument,
  validateAgencyInvitation,
} from "@/src/features/profile/services/profile.service";
import { rewriteAgencyPasswordSetupLink } from "../utils/normalizeAgencyInvitationLink";
import type { AgencyInvitationFormValues } from "../components/AgencyInvitationForm";

type AgencyInvitationStep = "loading" | "error" | "form" | "success";

export function useAgencyInvitationScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const t = useTranslations("auth.agencyInvitation");

  const token = searchParams.get("token")?.trim() ?? "";
  const [invitation, setInvitation] = useState<AgencyInvitationPreview | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [passwordSetupLink, setPasswordSetupLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const step = useMemo((): AgencyInvitationStep => {
    if (isLoading) {
      return "loading";
    }

    if (validationError) {
      return "error";
    }

    if (passwordSetupLink || isAccepted) {
      return "success";
    }

    return "form";
  }, [isAccepted, isLoading, passwordSetupLink, validationError]);

  useEffect(() => {
    let cancelled = false;

    async function loadInvitation() {
      if (!token) {
        setValidationError(t("missingToken"));
        setIsLoading(false);
        return;
      }

      try {
        const preview = await validateAgencyInvitation(token);
        if (cancelled) {
          return;
        }

        setInvitation(preview);
        const setupLink = rewriteAgencyPasswordSetupLink(preview.password_setup_link);
        if (setupLink && preview.status?.toUpperCase().includes("PASSWORD")) {
          setPasswordSetupLink(setupLink);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        setValidationError(
          error instanceof Error ? error.message : t("invalidInvitation"),
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadInvitation();

    return () => {
      cancelled = true;
    };
  }, [t, token]);

  const initialValues = useMemo<AgencyInvitationFormValues>(
    () => ({
      agencyName: invitation?.agency_name ?? "",
      tradeName: invitation?.agency_trade_name ?? "",
      email: invitation?.email ?? "",
      phone: invitation?.phone ?? "",
    }),
    [invitation],
  );

  const onSubmit = useCallback(
    async (values: AgencyInvitationFormValues & { legalDocument: File }) => {
      if (!token) {
        return;
      }

      setSubmitError(null);

      try {
        setIsUploading(true);
        const legalDocumentUrl = await uploadAgencyInvitationLegalDocument(
          values.legalDocument,
          token,
        );
        setIsUploading(false);
        setIsSubmitting(true);

        const response = await acceptAgencyInvitation({
          token,
          agency_name: values.agencyName.trim(),
          agency_trade_name: values.tradeName.trim(),
          phone: values.phone.trim(),
          legal_document_s3_link: legalDocumentUrl,
        });

        const setupLink = rewriteAgencyPasswordSetupLink(
          response.data?.invitation_link ??
            (response.data as { password_setup_link?: string | null } | null)
              ?.password_setup_link,
        );

        setPasswordSetupLink(setupLink);
        setIsAccepted(true);
        toast.success(t("successTitle"), {
          description: response.message || t("successDescription"),
        });
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : t("submitFailed"),
        );
      } finally {
        setIsUploading(false);
        setIsSubmitting(false);
      }
    },
    [t, toast, token],
  );

  const onGoToSignIn = useCallback(() => {
    router.replace("/");
  }, [router]);

  const onOpenPasswordSetup = useCallback(() => {
    const url = passwordSetupLink?.trim();
    if (!url) {
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }, [passwordSetupLink]);

  const onCopyPasswordSetupLink = useCallback(async () => {
    const url = passwordSetupLink?.trim();
    if (!url) {
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success(t("copySetupLinkSuccessTitle"), {
        description: t("copySetupLinkSuccessDescription"),
      });
    } catch {
      toast.error(t("copySetupLinkErrorTitle"), {
        description: t("copySetupLinkErrorDescription"),
      });
    }
  }, [passwordSetupLink, t, toast]);

  return {
    step,
    validationError,
    submitError,
    isSubmitting,
    isUploading,
    passwordSetupLink,
    initialValues,
    formKey: invitation?.email ?? token,
    labels: {
      title: t("title"),
      subtitle: t("subtitle"),
      loading: t("loading"),
      errorTitle: t("errorTitle"),
      successTitle: t("successTitle"),
      successDescription: t("successDescription"),
      setupLinkLabel: t("setupLinkLabel"),
      copySetupLink: t("copySetupLink"),
      openPasswordSetup: t("openPasswordSetup"),
      goToSignIn: t("goToSignIn"),
    },
    handlers: {
      onSubmit,
      onGoToSignIn,
      onOpenPasswordSetup,
      onCopyPasswordSetupLink,
    },
  };
}

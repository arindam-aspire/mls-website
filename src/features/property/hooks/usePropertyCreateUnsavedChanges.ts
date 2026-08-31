"use client";

import {
  INITIAL_PROPERTY_FORM_VALUES,
} from "@/src/features/property/constants/propertyForm.constants";
import type { PropertyCreateFormStepId } from "@/src/features/property/constants/propertyCreateFormSteps.constants";
import {
  buildPropertyCreateStepSnapshot,
  computeDirtyPropertyCreateSteps,
  hasPropertyCreateUnsavedChanges,
  type PropertyCreateStepSnapshot,
} from "@/src/features/property/utils/propertyCreateDirtyState.utils";
import { useRouter } from "@/src/i18n/navigation";
import { stripLocalePrefixFromHref } from "@/src/i18n/stripLocalePrefixFromPath";
import {
  registerNavigationInterceptor,
  type NavigationIntentAction,
} from "@/src/navigation/navigationGuard";
import type { PropertyFormValues } from "@abdoun/abdoun-library";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type PendingNavigationAction = "push" | "back" | "reload";

type PendingNavigation = {
  href: string;
  action: PendingNavigationAction;
};

function toPendingNavigationAction(
  action: NavigationIntentAction,
): PendingNavigationAction {
  if (action === "replace") {
    return "push";
  }

  return action;
}

type UsePropertyCreateUnsavedChangesParams = {
  enabled: boolean;
  canEdit: boolean;
  isDraftSaving: boolean;
  onDraft: (propertyDetails: PropertyFormValues) => Promise<boolean>;
  propertyDetails: PropertyFormValues;
};

function isSameDocumentLocation(href: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const nextUrl = new URL(href, window.location.origin);
    const currentUrl = new URL(window.location.href);

    return (
      nextUrl.pathname === currentUrl.pathname &&
      nextUrl.search === currentUrl.search &&
      nextUrl.hash === currentUrl.hash
    );
  } catch {
    return false;
  }
}

function isInternalNavigationHref(href: string | null): href is string {
  if (!href || href.startsWith("#")) {
    return false;
  }

  if (href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  return true;
}

export function usePropertyCreateUnsavedChanges({
  enabled,
  canEdit,
  isDraftSaving,
  onDraft,
  propertyDetails,
}: UsePropertyCreateUnsavedChangesParams) {
  const router = useRouter();
  const t = useTranslations("propertyList.propertyCreate.unsavedChanges");

  const savedSnapshotRef = useRef<PropertyCreateStepSnapshot>(
    buildPropertyCreateStepSnapshot(INITIAL_PROPERTY_FORM_VALUES),
  );
  const allowNavigationRef = useRef(false);
  const historyTrapActiveRef = useRef(false);
  const skipHistoryGuardRef = useRef(false);
  const guardActiveRef = useRef(false);

  const [dirtyStepIds, setDirtyStepIds] = useState<PropertyCreateFormStepId[]>(
    [],
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingNavigation, setPendingNavigation] =
    useState<PendingNavigation | null>(null);

  const guardActive = enabled && canEdit && hasUnsavedChanges;

  const commitSavedSnapshot = useCallback((propertyDetails: PropertyFormValues) => {
    guardActiveRef.current = false;
    savedSnapshotRef.current = buildPropertyCreateStepSnapshot(propertyDetails);
    setDirtyStepIds([]);
    setHasUnsavedChanges(false);
  }, []);

  const syncDirtyState = useCallback((propertyDetails: PropertyFormValues) => {
    const nextDirtyStepIds = computeDirtyPropertyCreateSteps(
      propertyDetails,
      savedSnapshotRef.current,
    );

    setDirtyStepIds(nextDirtyStepIds);
    setHasUnsavedChanges(nextDirtyStepIds.length > 0);
  }, []);

  const onLivePayloadChange = useCallback(
    (nextPropertyDetails: PropertyFormValues) => {
      if (!enabled || !canEdit) {
        return;
      }

      syncDirtyState(nextPropertyDetails);
    },
    [canEdit, enabled, syncDirtyState],
  );

  useEffect(() => {
    guardActiveRef.current = guardActive;
  }, [guardActive]);

  useEffect(() => {
    onLivePayloadChange(propertyDetails);
  }, [onLivePayloadChange, propertyDetails]);

  const closePrompt = useCallback(() => {
    setPendingNavigation(null);
  }, []);

  const completePendingNavigation = useCallback(
    (navigation: PendingNavigation) => {
      allowNavigationRef.current = true;

      if (navigation.action === "back") {
        skipHistoryGuardRef.current = true;
        history.back();
        return;
      }

      if (navigation.action === "reload") {
        window.location.reload();
        return;
      }

      router.push(stripLocalePrefixFromHref(navigation.href));
    },
    [router],
  );

  const requestNavigation = useCallback(
    (navigation: PendingNavigation) => {
      if (!guardActiveRef.current || allowNavigationRef.current) {
        allowNavigationRef.current = false;
        completePendingNavigation(navigation);
        return;
      }

      setPendingNavigation(navigation);
    },
    [completePendingNavigation],
  );

  const openReloadPrompt = useCallback(() => {
    requestNavigation({ href: "", action: "reload" });
  }, [requestNavigation]);

  const handleCancelPrompt = useCallback(() => {
    closePrompt();
  }, [closePrompt]);

  const handleDiscardPrompt = useCallback(() => {
    const navigation = pendingNavigation;

    if (!navigation) {
      closePrompt();
      return;
    }

    allowNavigationRef.current = true;
    setHasUnsavedChanges(false);
    setDirtyStepIds([]);
    closePrompt();
    completePendingNavigation(navigation);
  }, [closePrompt, completePendingNavigation, pendingNavigation]);

  const handleSaveDraftFromPrompt = useCallback(async () => {
    const navigation = pendingNavigation;
    const didSave = await onDraft(propertyDetails);

    if (!didSave) {
      return;
    }

    closePrompt();

    if (navigation) {
      completePendingNavigation(navigation);
    }
  }, [
    closePrompt,
    completePendingNavigation,
    onDraft,
    pendingNavigation,
    propertyDetails,
  ]);

  useEffect(() => {
    if (!guardActive) {
      return;
    }

    return registerNavigationInterceptor((intent) => {
      if (allowNavigationRef.current) {
        allowNavigationRef.current = false;
        return true;
      }

      requestNavigation({
        href: intent.href,
        action: toPendingNavigationAction(intent.action),
      });

      return false;
    });
  }, [guardActive, requestNavigation]);

  useEffect(() => {
    if (!guardActive) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (pendingNavigation != null) {
        return;
      }

      const isReloadShortcut =
        event.key === "F5" ||
        event.code === "F5" ||
        ((event.code === "KeyR" || event.key.toLowerCase() === "r") &&
          (event.ctrlKey || event.metaKey) &&
          !event.shiftKey);

      if (!isReloadShortcut) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
      openReloadPrompt();
    };

    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [guardActive, openReloadPrompt, pendingNavigation]);

  useEffect(() => {
    if (!guardActive) {
      historyTrapActiveRef.current = false;
      return;
    }

    if (!historyTrapActiveRef.current) {
      history.pushState({ propertyCreateGuard: true }, "", window.location.href);
      historyTrapActiveRef.current = true;
    }

    const handlePopState = () => {
      if (skipHistoryGuardRef.current) {
        skipHistoryGuardRef.current = false;
        return;
      }

      history.pushState({ propertyCreateGuard: true }, "", window.location.href);
      requestNavigation({ href: "", action: "back" });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      historyTrapActiveRef.current = false;
    };
  }, [guardActive, requestNavigation]);

  useEffect(() => {
    if (!guardActive) {
      return;
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (allowNavigationRef.current) {
        allowNavigationRef.current = false;
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a");

      if (!anchor) {
        return;
      }

      if (anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const href = anchor.getAttribute("href");

      if (!isInternalNavigationHref(href) || isSameDocumentLocation(href)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      requestNavigation({
        href: stripLocalePrefixFromHref(href),
        action: "push",
      });
    };

    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [guardActive, requestNavigation]);

  const unsavedChangesModal = useMemo(
    () => ({
      open: pendingNavigation != null,
      title: t("title"),
      description: t("description"),
      saveDraftLabel: t("saveDraft"),
      discardLabel: t("discard"),
      cancelLabel: t("cancel"),
      savingDraftLabel: t("savingDraft"),
      isSavingDraft: isDraftSaving,
      onSaveDraft: handleSaveDraftFromPrompt,
      onDiscard: handleDiscardPrompt,
      onCancel: handleCancelPrompt,
    }),
    [
      handleCancelPrompt,
      handleDiscardPrompt,
      handleSaveDraftFromPrompt,
      isDraftSaving,
      pendingNavigation,
      t,
    ],
  );

  return {
    dirtyStepIds,
    hasUnsavedChanges,
    guardActive,
    commitSavedSnapshot,
    onLivePayloadChange,
    unsavedChangesModal,
    hasPropertyCreateUnsavedChanges: (
      propertyDetails: PropertyFormValues,
    ) =>
      hasPropertyCreateUnsavedChanges(
        propertyDetails,
        savedSnapshotRef.current,
      ),
  };
}

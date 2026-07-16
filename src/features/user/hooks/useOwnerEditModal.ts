"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { OwnerListRow } from "../mappers/mapOwnerListItemToLibraryOwner";
import { useUpdateOwner } from "../mutations/owner.mutation";

type OwnerEditFormState = {
  fullName: string;
  email: string;
  phone: string;
};

type OwnerEditFormErrors = Partial<Record<keyof OwnerEditFormState, string>>;

const EMPTY_FORM: OwnerEditFormState = {
  fullName: "",
  email: "",
  phone: "",
};

export function useOwnerEditModal() {
  const t = useTranslations("user.owners.editModal");
  const { mutateAsync: updateOwner, isPending: isSaving } = useUpdateOwner();

  const [owner, setOwner] = useState<OwnerListRow | null>(null);
  const [form, setForm] = useState<OwnerEditFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<OwnerEditFormErrors>({});

  const openModal = useCallback((nextOwner: OwnerListRow) => {
    setOwner(nextOwner);
    setForm({
      fullName: nextOwner.name ?? "",
      email: nextOwner.email ?? "",
      phone: nextOwner.phone ?? "",
    });
    setErrors({});
  }, []);

  const closeModal = useCallback(() => {
    if (isSaving) {
      return;
    }

    setOwner(null);
    setForm(EMPTY_FORM);
    setErrors({});
  }, [isSaving]);

  useEffect(() => {
    if (!owner) {
      return;
    }

    setForm({
      fullName: owner.name ?? "",
      email: owner.email ?? "",
      phone: owner.phone ?? "",
    });
  }, [owner]);

  const onFieldChange = useCallback(
    (field: keyof OwnerEditFormState, value: string) => {
      setForm((previous) => ({ ...previous, [field]: value }));
      setErrors((previous) => {
        if (!previous[field]) {
          return previous;
        }

        const next = { ...previous };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const validate = useCallback((): boolean => {
    const nextErrors: OwnerEditFormErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = t("validation.nameRequired");
    }

    if (!form.email.trim()) {
      nextErrors.email = t("validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = t("validation.emailInvalid");
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [form.email, form.fullName, t]);

  const onSubmit = useCallback(async () => {
    if (!owner || !validate()) {
      return;
    }

    try {
      await updateOwner({
        ownerId: owner.id,
        body: {
          full_name: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
        },
      });
      setOwner(null);
      setForm(EMPTY_FORM);
      setErrors({});
    } catch {
      // Error toast handled in mutation.
    }
  }, [form.email, form.fullName, form.phone, owner, updateOwner, validate]);

  const modal = useMemo(() => {
    if (!owner) {
      return null;
    }

    return {
      open: true,
      title: t("title"),
      description: t("description"),
      fullNameLabel: t("fullNameLabel"),
      emailLabel: t("emailLabel"),
      phoneLabel: t("phoneLabel"),
      saveLabel: t("save"),
      cancelLabel: t("cancel"),
      savingLabel: t("saving"),
      form,
      errors,
      isSaving,
      onFieldChange,
      onClose: closeModal,
      onSubmit,
    };
  }, [closeModal, errors, form, isSaving, onFieldChange, onSubmit, owner, t]);

  return {
    openModal,
    modal,
  };
}

export type UseOwnerEditModalReturn = ReturnType<typeof useOwnerEditModal>;

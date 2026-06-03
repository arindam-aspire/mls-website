"use client";

import { useTranslations } from "next-intl";
import { useCallback, type Dispatch, type SetStateAction } from "react";
import { useChangePassword } from "@/src/features/auth/mutations/auth.mutation";
import { useToast } from "@/src/hooks/useToast";
import type { ChangePasswordFormValues } from "../components/ChangePasswordForm";

type UseChangePasswordModalParams = {
  setIsOpenChangePassword: Dispatch<SetStateAction<boolean>>;
};

export function useChangePasswordModal({
  setIsOpenChangePassword,
}: UseChangePasswordModalParams) {
  // 2. UI utilities
  const t = useTranslations("common");
  const toast = useToast();

  // 5. Data fetching / queries
  const { mutate: changePassword, isPending } = useChangePassword();

  // 7. Callbacks
  const closeModal = useCallback(() => {
    setIsOpenChangePassword(false);
  }, [setIsOpenChangePassword]);

  const handleSubmit = useCallback(
    (values: ChangePasswordFormValues) => {
      changePassword(
        {
          password: values.newPassword,
          previous_password: values.currentPassword,
        },
        {
          onSuccess: () => {
            toast.success(t("changePassword"), {
              description: t("changePasswordSuccessDescription"),
            });
            setIsOpenChangePassword(false);
          },
        },
      );
    },
    [changePassword, setIsOpenChangePassword, t, toast],
  );

  // 10. Return values
  return {
    title: t("changePassword"),
    description: t("changePasswordDescription"),
    isSubmitting: isPending,
    closeModal,
    handleSubmit,
  };
}

export type { UseChangePasswordModalParams };

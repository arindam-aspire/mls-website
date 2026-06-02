"use client";

import { useTranslations } from "next-intl";
import type { Dispatch, SetStateAction } from "react";
import { useChangePassword } from "@/src/features/auth/mutations/auth.mutation";
import { useToast } from "@/src/hooks/useToast";
import type { ChangePasswordFormValues } from "../components/ChangePasswordForm";

type UseChangePasswordModalParams = {
  setIsOpenChangePassword: Dispatch<SetStateAction<boolean>>;
};

export function useChangePasswordModal({
  setIsOpenChangePassword,
}: UseChangePasswordModalParams) {
  // 1. Router & navigation

  // 2. UI utilities
  const t = useTranslations("common");
  const toast = useToast();

  // 3. Global state (Zustand / Redux / Context)

  // 4. Local state

  // 5. Data fetching / queries
  const { mutate: changePassword, isPending } = useChangePassword();

  // 6. Derived / memoized values

  // 7. Callbacks
  const closeModal = () => {
    setIsOpenChangePassword(false);
  };

  const handleSubmit = (values: ChangePasswordFormValues) => {
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
  };

  // 8. Refs

  // 9. Effects (always last)

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

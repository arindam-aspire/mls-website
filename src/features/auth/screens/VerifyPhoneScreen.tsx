"use client";

import {
  Link,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalPanel,
} from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import { captionTextClasses } from "@/src/lib/typography";
import { AuthModalHeader } from "../components/AuthModalHeader";
import { OtpVerificationTitle } from "../components/OtpVerificationTitle";
import { OTPVerificationForm } from "../components/OTPVerificationForm";
import { useVerifyPhoneScreen } from "../hooks/useVerifyPhoneScreen";

export function VerifyPhoneScreen() {
  const {
    contactPhone,
    onSubmit,
    onResend,
    isLoading,
    isResending,
    termsText,
    privacyText,
  } = useVerifyPhoneScreen();

  return (
    <ModalPanel size="md">
      <AuthModalHeader showBack={false} />
      <ModalCloseButton />
      <ModalContent className="!py-0 sm:!py-0">
        <OtpVerificationTitle
          contactPhone={contactPhone}
          titleKey="verifyPhoneTitle"
        />
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <OTPVerificationForm
            onSubmit={onSubmit}
            onResend={onResend}
            isLoading={isLoading}
            isResending={isResending}
          />
        </div>
      </ModalContent>
      <ModalFooter className="!block rounded-b-xl border-t-0 bg-primary-light !px-4 !pt-4 !pb-4 dark:bg-page sm:!gap-3 sm:!px-6 sm:!pb-6">
        <div
          className={cn(
            "flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-muted",
            captionTextClasses,
          )}
        >
          <Link
            color="muted"
            variant="subtle"
            size="sm"
            className="font-normal"
            alwaysUnderline={false}
          >
            {termsText}
          </Link>
          <span className="text-muted/60" aria-hidden>
            •
          </span>
          <Link
            color="muted"
            variant="subtle"
            size="sm"
            className="font-normal"
            alwaysUnderline={false}
          >
            {privacyText}
          </Link>
        </div>
      </ModalFooter>
    </ModalPanel>
  );
}

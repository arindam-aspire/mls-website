"use client";

import { UpcomingFeatureModal } from "@/src/components/common/UpcomingFeatureModal";
import {
  Link,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalPanel,
} from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import {
  headingAuthClasses,
  bodyTextClasses,
  bodyLargeTextClasses,
  captionTextClasses,
} from "@/src/lib/typography";
import { AuthModalHeader } from "../components/AuthModalHeader";
import { SocialAuthForm, type SocialAccountType } from "../components/SocialAuthForm";
import { useSocialRegistrationScreen } from "../hooks/useSocialRegistrationScreen";

type SocialRegistrationScreenProps = {
  type: SocialAccountType;
};

export function SocialRegistrationScreen({ type }: SocialRegistrationScreenProps) {
  const {
    title,
    subtitle,
    accountType,
    onSocialProviderClick,
    hasAccountText,
    signInText,
    onSignInClick,
    isUpcomingFeatureModalOpen,
    onCloseUpcomingFeatureModal,
    showBack,
    onBack,
    termsText,
    privacyText,
  } = useSocialRegistrationScreen({ type });

  return (
    <>
      <ModalPanel size="md">
        <AuthModalHeader showBack={showBack} onBack={onBack} />
        <ModalCloseButton />
        <ModalContent className="!py-0 sm:!py-0">
          <div className="space-y-1 px-4 !pb-4 text-center sm:px-6">
            <h2 className={headingAuthClasses}>{title}</h2>
            <p className={cn(bodyTextClasses, "text-muted")}>{subtitle}</p>
          </div>
          <SocialAuthForm
            flow="signup"
            accountType={accountType}
            onSocialProviderClick={onSocialProviderClick}
          />
        </ModalContent>
        <ModalFooter className="!block rounded-b-xl border-t-0 bg-primary-light !px-4 !pt-4 !pb-4 dark:bg-page sm:!gap-3 sm:!px-6 sm:!pb-6">
          <div className="space-y-2">
            <p className={cn(bodyLargeTextClasses, "text-center text-muted")}>
              {hasAccountText}
            </p>
            <div className="flex justify-center">
              <Link
                color="primary"
                size="lg"
                className="text-center font-semibold"
                onClick={onSignInClick}
              >
                {signInText}
              </Link>
            </div>
            <div className={cn("flex flex-wrap items-center justify-center gap-x-2 gap-y-1 pt-1 text-muted", captionTextClasses)}>
              <Link color="muted" variant="subtle" size="sm" className="font-normal" alwaysUnderline={false}>
                {termsText}
              </Link>
              <span className="text-muted/60" aria-hidden>
                •
              </span>
              <Link color="muted" variant="subtle" size="sm" className="font-normal" alwaysUnderline={false}>
                {privacyText}
              </Link>
            </div>
          </div>
        </ModalFooter>
      </ModalPanel>

      <UpcomingFeatureModal
        open={isUpcomingFeatureModalOpen}
        onClose={onCloseUpcomingFeatureModal}
      />
    </>
  );
}

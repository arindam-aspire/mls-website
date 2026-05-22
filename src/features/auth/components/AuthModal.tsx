"use client";

import { useSearchParams } from "next/navigation";
import {
  Modal,
  ModalBackdrop,
  ModalCloseButton,
  ModalContainer,
  ModalContent,
  ModalPanel,
} from "@/src/components/ui";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { OTPVerificationForm } from "./OTPVerificationForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { SignInForm } from "./SignInForm";
import { SignInWithOTPForm } from "./SignInWithOTPForm";
import { SignUpForm } from "./SignUpForm";

export const AUTH_QUERY_KEY = "auth";

export const AUTH_VIEW = {
  signIn: "signin",
  signUp: "signup",
  forgotPassword: "forgot-password",
  resetPassword: "reset-password",
  signInOtp: "signin-otp",
  otpVerify: "otp-verify",
} as const;

export type AuthView = (typeof AUTH_VIEW)[keyof typeof AUTH_VIEW];

const VALID_AUTH_VIEWS = new Set<string>(Object.values(AUTH_VIEW));

function renderAuthView(view: string | null) {
  switch (view) {
    case AUTH_VIEW.signIn:
      return <SignInForm />;
    case AUTH_VIEW.signUp:
      return <SignUpForm />;
    case AUTH_VIEW.forgotPassword:
      return <ForgotPasswordForm />;
    case AUTH_VIEW.resetPassword:
      return <ResetPasswordForm />;
    case AUTH_VIEW.signInOtp:
      return <SignInWithOTPForm />;
    case AUTH_VIEW.otpVerify:
      return <OTPVerificationForm />;
    default:
      return null;
  }
}

export function AuthModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const authView = searchParams.get(AUTH_QUERY_KEY);
  const isOpen = authView != null && VALID_AUTH_VIEWS.has(authView);
  const content = renderAuthView(authView);

  const closeModal = () => {
    router.replace(pathname);
  };

  if (content == null) {
    return null;
  }

  return (
    <Modal open={isOpen} onClose={closeModal}>
      <ModalBackdrop />
      <ModalContainer>
        <ModalPanel size="md" className="p-4 sm:p-6">
          <ModalCloseButton />
          <ModalContent className="py-6 sm:py-8">{content}</ModalContent>
        </ModalPanel>
      </ModalContainer>
    </Modal>
  );
}

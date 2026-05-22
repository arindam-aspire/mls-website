"use client";

import mlsLogoDark from "@/src/assets/images/MLS_Dark_Logo.png";
import mlsLogoLight from "@/src/assets/images/MLS_Light_Logo.png";
import {
  Modal,
  ModalBackdrop,
  ModalContainer
} from "@/src/components/ui";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useSearchParams } from "next/navigation";
import { AccountChooseScreen } from "../screens/AccountChooseScreen";
import { SignInScreen } from "../screens/SignInScreen";
import { UserRegistrationScreen } from "../screens/UserRegistrationScreen";
import { SocialRegistrationScreen } from "../screens/SocialRegistrationScreen";
import { SocialSignInScreen } from "../screens/SocialSignInScreen";
import type {
  ChooseAccountMode,
  ChooseAccountType,
} from "./ChooseAccountForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { OTPVerificationForm } from "./OTPVerificationForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { SignInWithOTPForm } from "./SignInWithOTPForm";

export const AUTH_QUERY_KEY = "auth";
export const CHOOSE_ACCOUNT_QUERY_KEY = "choose-account";

export const AUTH_VIEW = {
  chooseAccount: "choose-account",
  userSocialSignIn: "user-social-sign-in",
  userSocialSignUp: "user-social-sign-up",
  ownerSocialSignIn: "owner-social-sign-in",
  ownerSocialSignUp: "owner-social-sign-up",
  userSignIn: "user-sign-in",
  ownerSignIn: "owner-sign-in",
  userSignUp: "user-sign-up",
  ownerSignUp: "owner-sign-up",
  forgotPassword: "forgot-password",
  resetPassword: "reset-password",
  signInOtp: "signin-otp",
  otpVerify: "otp-verify",
} as const;

export type AuthView = (typeof AUTH_VIEW)[keyof typeof AUTH_VIEW];

const VALID_AUTH_VIEWS = new Set<string>(Object.values(AUTH_VIEW));

export function resolveAccountTypeAuthView(
  type: ChooseAccountType,
  mode: ChooseAccountMode,
): AuthView | null {
  if (type === "user") {
    return mode === "signin"
      ? AUTH_VIEW.userSocialSignIn
      : AUTH_VIEW.userSocialSignUp;
  }
  if (type === "owner") {
    return mode === "signin"
      ? AUTH_VIEW.ownerSocialSignIn
      : AUTH_VIEW.ownerSocialSignUp;
  }
  return null;
}

export function resolveEmailSignInView(type: "user" | "owner"): AuthView {
  return type === "user" ? AUTH_VIEW.userSignIn : AUTH_VIEW.ownerSignIn;
}

export function resolveEmailSignUpView(type: "user" | "owner"): AuthView {
  return type === "user" ? AUTH_VIEW.userSignUp : AUTH_VIEW.ownerSignUp;
}

function renderAuthView(view: string | null) {
  switch (view) {
    case AUTH_VIEW.chooseAccount:
      return <AccountChooseScreen />;
    case AUTH_VIEW.userSocialSignIn:
    case AUTH_VIEW.ownerSocialSignIn:
      return (
        <SocialSignInScreen
          type={view === AUTH_VIEW.userSocialSignIn ? "user" : "owner"}
        />
      );
    case AUTH_VIEW.userSocialSignUp:
    case AUTH_VIEW.ownerSocialSignUp:
      return (
        <SocialRegistrationScreen
          type={view === AUTH_VIEW.userSocialSignUp ? "user" : "owner"}
        />
      );
    case AUTH_VIEW.userSignIn:
    case AUTH_VIEW.ownerSignIn:
      return (
        <SignInScreen type={view === AUTH_VIEW.userSignIn ? "user" : "owner"} />
      );
    case AUTH_VIEW.userSignUp:
    case AUTH_VIEW.ownerSignUp:
      return (
        <UserRegistrationScreen
          type={view === AUTH_VIEW.userSignUp ? "user" : "owner"}
        />
      );
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

  const hasChooseAccount = searchParams.has(CHOOSE_ACCOUNT_QUERY_KEY);
  const authView = searchParams.get(AUTH_QUERY_KEY);
  const activeView = hasChooseAccount ? AUTH_VIEW.chooseAccount : authView;
  const isOpen = activeView != null && VALID_AUTH_VIEWS.has(activeView);
  const content = renderAuthView(activeView);

  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? mlsLogoDark : mlsLogoLight;

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
       {content}
      </ModalContainer>
    </Modal>
  );
}

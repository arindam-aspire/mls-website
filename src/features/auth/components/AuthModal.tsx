"use client";

import { useEffect } from "react";
import {
  Modal,
  ModalBackdrop,
  ModalContainer,
} from "@/src/components/ui";
import { AUTH_VIEW, type AuthView } from "../authViews";
import { readAuthModalSession } from "../store/authModalStorage";
import { useAuthStore } from "../store/auth.store";
import { AgencyEmailSignInScreen } from "../screens/AgencyEmailSignInScreen";
import { AgencyRegistrationScreen } from "../screens/AgencyRegistrationScreen";
import { AgencySignInScreen } from "../screens/AgencySignInScreen";
import { AccountChooseScreen } from "../screens/AccountChooseScreen";
import { ForgotPasswordScreen } from "../screens/ForgotPasswordScreen";
import { ResetPasswordScreen } from "../screens/ResetPasswordScreen";
import { SignInScreen } from "../screens/SignInScreen";
import { OTPVerificationScreen } from "../screens/OTPVerificationScreen";
import { SignInWithOTPScreen } from "../screens/SignInWithOTPScreen";
import { SocialRegistrationScreen } from "../screens/SocialRegistrationScreen";
import { SocialSignInScreen } from "../screens/SocialSignInScreen";
import { UserRegistrationScreen } from "../screens/UserRegistrationScreen";
import { ConfirmSignUpScreen } from "../screens/ConfirmSignUpScreen";

export { AUTH_VIEW, type AuthView } from "../authViews";
export {
  resolveAccountTypeAuthView,
  resolveEmailSignInView,
  resolveEmailSignUpView,
  resolveSignInRoleFromAuthContext,
} from "../authViews";

function renderAuthView(screen: AuthView) {
  switch (screen) {
    case AUTH_VIEW.chooseAccount:
      return <AccountChooseScreen />;
    case AUTH_VIEW.userSocialSignIn:
      return <SocialSignInScreen type="user" />;
    case AUTH_VIEW.ownerSocialSignIn:
      return <SocialSignInScreen type="owner" />;
    case AUTH_VIEW.userSocialSignUp:
      return <SocialRegistrationScreen type="user" />;
    case AUTH_VIEW.ownerSocialSignUp:
      return <SocialRegistrationScreen type="owner" />;
    case AUTH_VIEW.userSignIn:
      return <SignInScreen type="user" />;
    case AUTH_VIEW.ownerSignIn:
      return <SignInScreen type="owner" />;
    case AUTH_VIEW.userSignUp:
      return <UserRegistrationScreen type="user" />;
    case AUTH_VIEW.ownerSignUp:
      return <UserRegistrationScreen type="owner" />;
    case AUTH_VIEW.agencySignIn:
      return <AgencySignInScreen />;
    case AUTH_VIEW.agencySignUp:
      return <AgencyRegistrationScreen />;
    case AUTH_VIEW.agencyEmailSignIn:
      return <AgencyEmailSignInScreen />;
    case AUTH_VIEW.forgotPassword:
      return <ForgotPasswordScreen />;
    case AUTH_VIEW.resetPassword:
      return <ResetPasswordScreen />;
    case AUTH_VIEW.signInOtp:
      return <SignInWithOTPScreen />;
    case AUTH_VIEW.otpVerify:
      return <OTPVerificationScreen />;
    case AUTH_VIEW.confirmSignUp:
      return <ConfirmSignUpScreen />;
    default:
      return null;
  }
}

export function AuthModal() {
  const isOpen = useAuthStore((state) => state.isOpen);
  const screenStack = useAuthStore((state) => state.screenStack);
  const closeAuth = useAuthStore((state) => state.closeAuth);
  const activeScreen = screenStack[screenStack.length - 1] ?? null;
  const content = activeScreen != null ? renderAuthView(activeScreen) : null;

  // Restore persisted modal state after mount so SSR/first paint stay closed (no hydration mismatch).
  useEffect(() => {
    const session = readAuthModalSession();
    if (session.isOpen) {
      useAuthStore.setState(session);
    }
  }, []);

  if (!isOpen || content == null) {
    return null;
  }

  return (
    <Modal open={isOpen} onClose={closeAuth}>
      <ModalBackdrop />
      <ModalContainer>{content}</ModalContainer>
    </Modal>
  );
}

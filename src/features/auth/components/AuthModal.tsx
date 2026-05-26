"use client";

import {
  Modal,
  ModalBackdrop,
  ModalContainer,
} from "@/src/components/ui";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useSearchParams } from "next/navigation";
import {
  AUTH_QUERY_KEY,
  AUTH_VIEW,
  CHOOSE_ACCOUNT_QUERY_KEY,
  VALID_AUTH_VIEWS,
} from "../authViews";
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

export {
  AUTH_QUERY_KEY,
  AUTH_RETURN_VIEW_QUERY_KEY,
  AUTH_VIEW,
  buildAuthModalUrl,
  CHOOSE_ACCOUNT_QUERY_KEY,
  resolveAccountTypeAuthView,
  resolveEmailSignInView,
  resolveEmailSignUpView,
  type AuthView,
} from "../authViews";

function renderAuthView(view: string | null, onSighinSuccess: () => void) {
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
        <SignInScreen type={view === AUTH_VIEW.userSignIn ? "user" : "owner"} onSighinSuccess={onSighinSuccess} />
      );
    case AUTH_VIEW.userSignUp:
    case AUTH_VIEW.ownerSignUp:
      return (
        <UserRegistrationScreen
          type={view === AUTH_VIEW.userSignUp ? "user" : "owner"}
        />
      );
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
  const onSighinSuccess = () => {
   closeModal();
  };
  const content = renderAuthView(activeView, onSighinSuccess);


  const closeModal = () => {
    router.replace(pathname);
  };

  if (content == null) {
    return null;
  }

  return (
    <Modal open={isOpen} onClose={closeModal}>
      <ModalBackdrop />
      <ModalContainer>{content}</ModalContainer>
    </Modal>
  );
}

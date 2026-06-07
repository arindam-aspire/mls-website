# Repository structure

High-level layout of this repository (non-excluded paths only). Update this document when the on-disk tree changes in ways that affect listed paths.

**Excluded:** `.cursor/`, `.expo/`, `.git/`, `.idea/`, `.next/`, `.turbo/`, `.vercel/`, `.vscode/`, `build/`, `coverage/`, `docs/`, `node_modules/`, `out/`

**`.docs/`:** Mirrors `app/` and `src/` as markdown (`.md` per source file + folder `README.md`). Top-level indexes: `README.md`, `application.md`, `packages.md`.

```text
mls_website/
├── .gitignore
├── .docs/
│   ├── README.md
│   ├── application.md
│   ├── folder-structure.md
│   ├── packages.md
│   ├── app/
│   │   ├── layout.md
│   │   ├── loading.md
│   │   ├── page.md
│   │   └── [locale]/
│   │       ├── layout.md
│   │       ├── not-found.md
│   │       ├── [...rest]/
│   │       │   └── page.md
│   │       ├── (system)/
│   │       │   ├── README.md
│   │       │   ├── layout.md
│   │       │   └── unauthorized/
│   │       │       └── page.md
│   │       ├── (landing)/
│   │       │   ├── README.md
│   │       │   ├── layout.md
│   │       │   └── page.md
│   │       ├── (main)/
│   │       │   ├── README.md
│   │       │   ├── layout.md
│   │       │   ├── dashboard/
│   │       │   │   └── page.md
│   │       │   ├── my-profile/
│   │       │   │   └── page.md
│   │       │   ├── saved-searches/
│   │       │   │   └── page.md
│   │       │   └── favourites/
│   │       │       └── page.md
│   │       └── (property)/
│   │           ├── README.md
│   │           ├── layout.md
│   │           ├── inquiries/
│   │           │   └── page.md
│   │           ├── listing/
│   │           │   └── page.md
│   │           ├── property-list/
│   │           │   └── page.md
│   │           ├── propert-details/
│   │           │   └── [id]/
│   │           │       └── page.md
│   │           ├── recently-viewed/
│   │           │   └── page.md
│   └── src/
│       ├── README.md
│       ├── apis/
│       │   ├── README.md
│       │   ├── clients/
│       │   ├── core/
│       │   └── endpoints/
│       ├── components/
│       │   ├── README.md
│       │   ├── common/
│       │   │   └── README.md
│       │   └── ui/
│       │       └── README.md
│       ├── configs/
│       ├── features/
│       │   ├── README.md
│       │   ├── auth/
│       │   │   ├── README.md
│       │   │   ├── components/
│       │   │   │   └── README.md
│       │   │   ├── hooks/
│       │   │   │   └── README.md
│       │   │   ├── mutations/
│       │   │   ├── screens/
│       │   │   │   └── README.md
│       │   │   ├── services/
│       │   │   ├── store/
│       │   │   └── types/
│       │   │       ├── README.md
│       │   │       ├── auth.types.md
│       │   │       ├── changePassword.types.md
│       │   │       ├── chooseAccount.types.md
│       │   │       ├── forgotPassword.types.md
│       │   │       ├── index.md
│       │   │       ├── logout.types.md
│       │   │       ├── signIn.types.md
│       │   │       ├── signInOtp.types.md
│       │   │       ├── signUp.types.md
│       │   │       └── user.types.md
│       │   ├── dashboard/
│       │   ├── landing/
│       │   │   └── mutations/
│       │   │       ├── README.md
│       │   │       └── landing.mutation.md
│       │   ├── loading/
│       │   │   ├── README.md
│       │   │   └── screens/
│       │   │       └── index.md
│       │   ├── not-found/
│       │   ├── notifications/
│       │   ├── unauthorized/
│       │   ├── profile/
│       │   │   ├── README.md
│       │   │   ├── components/
│       │   │   │   ├── README.md
│       │   │   │   ├── AgencyDisplayPreferencesRows.md
│       │   │   │   ├── AgencyProfileCard.md
│       │   │   │   ├── ChangePasswordForm.md
│       │   │   │   ├── DisplayPreferenceOptionCard.md
│       │   │   │   ├── MyProfileCard.md
│       │   │   │   ├── MyProfileCardSkeleton.md
│       │   │   │   ├── ProfileAvatarUpload.md
│       │   │   │   ├── ProfilePageToolbar.md
│       │   │   │   ├── ProfilePageToolbarSkeleton.md
│       │   │   │   └── ProfileScreenSkeleton.md
│       │   │   ├── hooks/
│       │   │   │   ├── README.md
│       │   │   │   ├── index.md
│       │   │   │   ├── useAgencyCurrencyPreference.md
│       │   │   │   ├── useAgencyDisplayPreferencesRows.md
│       │   │   │   ├── useAgencyLogoUpload.md
│       │   │   │   ├── useAgencyMeasurementUnitPreference.md
│       │   │   │   ├── useChangePasswordModal.md
│       │   │   │   └── useProfileScreen.md
│       │   │   ├── mutations/
│       │   │   │   ├── README.md
│       │   │   │   └── index.md
│       │   │   ├── screens/
│       │   │   │   ├── ChangePasswordModal.md
│       │   │   │   └── ProfileScreen.md
│       │   │   ├── services/
│       │   │   │   ├── README.md
│       │   │   │   └── index.md
│       │   │   ├── store/
│       │   │   │   ├── README.md
│       │   │   │   └── index.md
│       │   │   ├── types/
│       │   │   │   ├── README.md
│       │   │   │   ├── index.md
│       │   │   │   └── profile.types.md
│       │   │   └── utils/
│       │   │       ├── README.md
│       │   │       └── index.md
│       │   └── property/
│       │       ├── components/
│       │       │   ├── README.md
│       │       │   ├── PropertyListAdvancedFilters.md
│       │       │   ├── PropertyListFilters.md
│       │       │   └── propertyListAdvancedFilters.constants.md
│       │       ├── hooks/
│       │       │   ├── README.md
│       │       │   ├── usePropertyDetails.md
│       │       │   ├── usePropertyList.md
│       │       │   └── usePropertySearchFilters.md
│       │       ├── mappers/
│       │       │   ├── README.md
│       │       │   ├── propertyFeatures.mapper.md
│       │       │   └── propertyList.mapper.md
│       │       ├── mutations/
│       │       │   ├── README.md
│       │       │   └── property.mutation.md
│       │       ├── screens/
│       │       │   └── README.md
│       │       ├── services/
│       │       │   ├── README.md
│       │       │   └── property.service.md
│       │       ├── store/
│       │       │   ├── README.md
│       │       │   └── property.store.md
│       │       ├── types/
│       │       │   ├── README.md
│       │       │   └── property.types.md
│       │       └── utils/
│       │           └── propertyAdvancedFieldVisibility.md
│       ├── hooks/
│       ├── i18n/
│       ├── initializers/
│       ├── layouts/
│       │   ├── README.md
│       │   ├── landing-layout/
│       │   │   ├── README.md
│       │   │   ├── index.md
│       │   │   ├── LandingBottomTabBar.md
│       │   │   ├── LandingDesktopActions.md
│       │   │   ├── LandingDesktopNav.md
│       │   │   ├── LandingFooter.md
│       │   │   ├── LandingHeader.md
│       │   │   ├── LandingHeaderThemeButton.md
│       │   │   ├── LandingMobileMenu.md
│       │   │   ├── LandingMain.md
│       │   │   ├── LandingNotificationsButton.md
│       │   │   └── LandingProfilePopover.md
│       │   ├── protected-layout/
│       │   │   ├── README.md
│       │   │   ├── hooks/
│       │   │   │   ├── useProtectedBottomTabBar.md
│       │   │   │   ├── useProtectedHeader.md
│       │   │   │   ├── useProtectedProfileMenu.md
│       │   │   │   ├── useProtectedSidebar.md
│       │   │   │   └── useProtectedSidebarNav.md
│       │   │   ├── index.md
│       │   │   ├── ProtectedBottomTabBar.md
│       │   │   ├── protectedBottomTab.config.md
│       │   │   ├── ProtectedDrawer.md
│       │   │   ├── ProtectedFooter.md
│       │   │   ├── ProtectedHeader.md
│       │   │   ├── ProtectedProfileMenu.md
│       │   │   ├── ProtectedNotificationsButton.md
│       │   │   ├── ProtectedSearchButton.md
│       │   │   ├── ProtectedThemeButton.md
│       │   │   ├── ProtectedMain.md
│       │   │   ├── ProtectedMobileDrawer.md
│       │   │   ├── ProtectedMobileMenu.md
│       │   │   ├── protectedMobileHeaderStyles.md
│       │   │   ├── ProtectedSidebar.md
│       │   │   ├── ProtectedSidebarNav.md
│       │   │   └── protectedSidebarNav.config.md
│       │   └── public-layout/
│       │       ├── PublicBottomTabBar.md
│       │       ├── PublicHeader.md
│       │       ├── PublicMobileMenu.md
│       │       ├── PublicNotificationsButton.md
│       │       └── README.md
│       ├── lib/
│       │   └── auth/
│       │       ├── README.md
│       │       ├── authorize.md
│       │       ├── hasPermission.md
│       │       ├── permissions.md
│       │       ├── roles.md
│       │       └── sidebarAccess.md
│       ├── messages/
│       ├── providers/
│       └── utils/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── [...rest]/
│   │   │   └── page.tsx
│   │   ├── not-found.tsx
│   │   ├── (auth)/
│   │   ├── (public)/
│   │   ├── (system)/
│   │   │   ├── layout.tsx
│   │   │   └── unauthorized/
│   │   │       └── page.tsx
│   │   ├── (landing)/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── (main)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── my-profile/
│   │   │   │   └── page.tsx
│   │   │   ├── saved-searches/
│   │   │   │   └── page.tsx
│   │   │   └── favourites/
│   │   │       └── page.tsx
│   │   └── (property)/
│   │       ├── layout.tsx
│   │       ├── inquiries/
│   │       │   └── page.tsx
│   │       ├── listing/
│   │       │   └── page.tsx
│   │       ├── propert-details/
│   │       │   └── [id]/
│   │       │       └── page.tsx
│   │       ├── property-list/
│   │       │   └── page.tsx
│   │       ├── recently-viewed/
│   │       │   └── page.tsx
│   ├── globals.css
│   ├── icon.png
│   ├── layout.tsx
│   ├── loading.tsx
│   └── page.tsx
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── proxy.ts
├── README.md
├── src/
│   ├── apis/
│   │   ├── clients/
│   │   │   └── api.client.ts
│   │   ├── core/
│   │   │   ├── axios.factory.ts
│   │   │   ├── axios.interceptor.ts
│   │   │   ├── error.normalizer.ts
│   │   │   ├── index.ts
│   │   │   ├── token.refresh.ts
│   │   │   └── token.store.ts
│   │   └── endpoints/
│   │       ├── agencyEndpoints.ts
│   │       ├── authEndpoints.ts
│   │       ├── index.ts
│   │       ├── profileEndpoints.ts
│   │       ├── propertyEndpoints.ts
│   │       └── publicEndpoints.ts
│   ├── assets/
│   │   └── images/
│   │       ├── favicon.png
│   │       ├── icon.svg
│   │       ├── MLS_Dark_Logo.png
│   │       ├── MLS_Home_Image.png
│   │       └── MLS_Light_Logo.png
│   ├── components/
│   │   ├── common/
│   │   │   ├── ComingSoonCard.tsx
│   │   │   ├── ConfirmModal.tsx
│   │   │   ├── LicenseDocumentUpload.tsx
│   │   │   ├── PasswordStrengthIndicator.tsx
│   │   │   └── UpcomingFeatureModal.tsx
│   │   ├── search/
│   │   │   ├── AnchoredDropdown.tsx
│   │   │   ├── BudgetField.tsx
│   │   │   ├── BudgetAutocompleteField.tsx
│   │   │   ├── BudgetSuggestionList.tsx
│   │   │   ├── BudgetRangeInputs.tsx
│   │   │   ├── budget.utils.ts
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   └── ui/
│   │       ├── fieldVariants.ts
│   │       ├── responsiveSizes.ts
│   │       ├── otp-verification/
│   │       │   ├── index.ts
│   │       │   ├── OtpVerificationForm.tsx
│   │       │   ├── OtpVerificationTitle.tsx
│   │       │   ├── types.ts
│   │       │   └── useOtpVerificationLabels.ts
│   │       ├── autocomplete-input/
│   │       │   ├── highlightLabel.tsx
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       ├── avatar/
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       ├── button/
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       ├── button-group/
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       ├── budget-select/
│   │       │   ├── index.tsx
│   │       │   ├── ranges.ts
│   │       │   ├── types.ts
│   │       │   └── utils.ts
│   │       ├── card/
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       ├── icon-button/
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       ├── input/
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       ├── phone-input/
│   │       │   ├── countries.ts
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       ├── link/
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       ├── modal/
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       ├── popover/
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       ├── index.tsx
│   │       ├── select/
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       ├── select-dropdown/
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       ├── search-input/
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       ├── skeleton/
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       ├── textarea/
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       ├── toaster/
│   │       │   ├── ToastIcons.tsx
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       ├── switch/
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       └── toggle-button/
│   │           ├── index.tsx
│   │           └── types.ts
│   ├── configs/
│   │   └── environment.config.ts
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── authorize.ts
│   │   │   ├── hasPermission.ts
│   │   │   ├── permissions.ts
│   │   │   ├── roles.ts
│   │   │   └── sidebarAccess.ts
│   │   ├── cn.ts
│   │   └── typography.ts
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authViews.ts
│   │   │   ├── maskContact.ts
│   │   │   ├── components/
│   │   │   │   ├── AgencyAuthForm.tsx
│   │   │   │   ├── AgencySignUpForm.tsx
│   │   │   │   ├── AuthModal.tsx
│   │   │   │   ├── AuthModalHeader.tsx
│   │   │   │   ├── AccountTypeCard.tsx
│   │   │   │   ├── ChooseAccountForm.tsx
│   │   │   │   ├── OtpVerificationTitle.tsx
│   │   │   │   ├── SocialAuthForm.tsx
│   │   │   │   ├── ForgotPasswordForm.tsx
│   │   │   │   ├── OTPVerificationForm.tsx
│   │   │   │   ├── ResetPasswordForm.tsx
│   │   │   │   ├── SignInForm.tsx
│   │   │   │   ├── SignInWithOTPForm.tsx
│   │   │   │   └── SignUpForm.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── authScreen.utils.ts
│   │   │   │   ├── authStack.utils.ts
│   │   │   │   ├── useAccountChooseScreen.ts
│   │   │   │   ├── useAgencyEmailSignInScreen.ts
│   │   │   │   ├── useAgencyRegistrationScreen.ts
│   │   │   │   ├── useAgencySignInScreen.ts
│   │   │   │   ├── useAuthPortal.ts
│   │   │   │   ├── useChooseAccountForm.ts
│   │   │   │   ├── useConfirmSignUpScreen.ts
│   │   │   │   ├── useForgotPasswordScreen.ts
│   │   │   │   ├── useOTPVerificationScreen.ts
│   │   │   │   ├── useResetPasswordScreen.ts
│   │   │   │   ├── useSignInScreen.ts
│   │   │   │   ├── useSignInWithOTPScreen.ts
│   │   │   │   ├── useSocialRegistrationScreen.ts
│   │   │   │   ├── useSocialSignInScreen.ts
│   │   │   │   └── useUserRegistrationScreen.ts
│   │   │   ├── mutations/
│   │   │   │   └── auth.mutation.ts
│   │   │   ├── screens/
│   │   │   │   ├── ConfirmSignUpScreen.tsx
│   │   │   │   ├── AccountChooseScreen.tsx
│   │   │   │   ├── AgencyEmailSignInScreen.tsx
│   │   │   │   ├── AgencyRegistrationScreen.tsx
│   │   │   │   ├── AgencySignInScreen.tsx
│   │   │   │   ├── ForgotPasswordScreen.tsx
│   │   │   │   ├── OTPVerificationScreen.tsx
│   │   │   │   ├── ResetPasswordScreen.tsx
│   │   │   │   ├── SignInScreen.tsx
│   │   │   │   ├── SignInWithOTPScreen.tsx
│   │   │   │   ├── SocialRegistrationScreen.tsx
│   │   │   │   ├── SocialSignInScreen.tsx
│   │   │   │   └── UserRegistrationScreen.tsx
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   ├── store/
│   │   │   │   ├── auth.navigation.ts
│   │   │   │   ├── auth.store.ts
│   │   │   │   └── authModalStorage.ts
│   │   │   ├── utils/
│   │   │   │   ├── postSignInRedirect.ts
│   │   │   │   └── resolveProfileRoleLabel.ts
│   │   │   └── types/
│   │   │       ├── auth.types.ts
│   │   │       ├── changePassword.types.ts
│   │   │       ├── chooseAccount.types.ts
│   │   │       ├── forgotPassword.types.ts
│   │   │       ├── index.ts
│   │   │       ├── logout.types.ts
│   │   │       ├── signIn.types.ts
│   │   │       ├── signInOtp.types.ts
│   │   │       ├── signUp.types.ts
│   │   │       ├── agencySignUp.types.ts
│   │   │       └── user.types.ts
│   │   ├── dashboard/
│   │   │   └── screens/
│   │   ├── loading/
│   │   │   └── screens/
│   │   │       └── index.tsx
│   │   ├── not-found/
│   │   │   └── screens/
│   │   │       └── NotFoundScreen.tsx
│   │   ├── notifications/
│   │   │   ├── components/
│   │   │   ├── constants/
│   │   │   ├── hooks/
│   │   │   ├── mutations/
│   │   │   ├── screens/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   ├── unauthorized/
│   │   │   └── screens/
│   │   │       └── UnauthorizedScreen.tsx
│   │   ├── landing/
│   │   │   ├── components/
│   │   │   │   ├── DetailsSection.tsx
│   │   │   │   ├── HeroSearchBar.tsx
│   │   │   │   └── HeroSection.tsx
│   │   │   ├── mutations/
│   │   │   │   └── landing.mutation.ts
│   │   │   ├── services/
│   │   │   │   └── landing.service.ts
│   │   │   ├── screens/
│   │   │   │   └── LandingScreen.tsx
│   │   │   ├── store/
│   │   │   ├── types/
│   │   │   │   ├── locationTaxonomy.types.ts
│   │   │   │   └── propertyTaxonomy.types.ts
│   │   │   └── utils/
│   │   │       └── locationTaxonomy.utils.ts
│   │   ├── profile/
│   │   │   ├── constants/
│   │   │   │   ├── agencyPreferences.ts
│   │   │   │   └── profileEditModal.constants.ts
│   │   │   ├── components/
│   │   │   │   ├── AgencyDisplayPreferencesRows.tsx
│   │   │   │   ├── AgencyProfileCard.tsx
│   │   │   │   ├── ChangePasswordForm.tsx
│   │   │   │   ├── DisplayPreferenceOptionCard.tsx
│   │   │   │   ├── EditAgencyForm.tsx
│   │   │   │   ├── EditEmailForm.tsx
│   │   │   │   ├── EditPhoneForm.tsx
│   │   │   │   ├── MyProfileCard.tsx
│   │   │   │   ├── MyProfileCardSkeleton.tsx
│   │   │   │   ├── ProfileAvatarDisplay.tsx
│   │   │   │   ├── ProfileAvatarUpload.tsx
│   │   │   │   ├── ProfileEditContactModal.tsx
│   │   │   │   ├── ProfileEditContactModalTitle.tsx
│   │   │   │   ├── ProfileOtpVerificationContact.tsx
│   │   │   │   ├── ProfileOtpVerificationForm.tsx
│   │   │   │   ├── ProfileOtpVerificationTitle.tsx
│   │   │   │   ├── ProfilePageToolbar.tsx
│   │   │   │   ├── ProfilePageToolbarSkeleton.tsx
│   │   │   │   └── ProfileScreenSkeleton.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── index.ts
│   │   │   │   ├── useAgencyCurrencyPreference.ts
│   │   │   │   ├── useAgencyDisplayPreferencesRows.ts
│   │   │   │   ├── useAgencyLogoUpload.ts
│   │   │   │   ├── useAgencyMeasurementUnitPreference.ts
│   │   │   │   ├── useChangePasswordModal.ts
│   │   │   │   ├── useEditAgencyModal.ts
│   │   │   │   ├── useEditEmailModal.ts
│   │   │   │   ├── useEditPhoneModal.ts
│   │   │   │   ├── useProfileAvatarUpload.ts
│   │   │   │   └── useProfileScreen.ts
│   │   │   ├── mutations/
│   │   │   │   ├── index.ts
│   │   │   │   └── profile.mutation.ts
│   │   │   ├── screens/
│   │   │   │   ├── ChangePasswordModal.tsx
│   │   │   │   ├── EditAgencyModal.tsx
│   │   │   │   ├── EditEmailModal.tsx
│   │   │   │   ├── EditPhoneModal.tsx
│   │   │   │   └── ProfileScreen.tsx
│   │   │   ├── services/
│   │   │   │   ├── index.ts
│   │   │   │   └── profile.service.ts
│   │   │   ├── store/
│   │   │   │   └── index.ts
│   │   │   ├── types/
│   │   │   │   ├── index.ts
│   │   │   │   └── profile.types.ts
│   │   │   └── utils/
│   │   │       ├── index.ts
│   │   │       ├── agencyApi.utils.ts
│   │   │       ├── agencyForm.utils.ts
│   │   │       ├── agencyPreferences.utils.ts
│   │   │       ├── formatPhoneNumberE164.ts
│   │   │       ├── licenseDocumentDisplay.ts
│   │   │       ├── parseStoredPhoneNumber.ts
│   │   │       ├── profileOtp.utils.ts
│   │   │       └── validateProfileImageFile.ts
│   │   └── property/
│   │       ├── components/
│   │       │   ├── PropertyListAdvancedFilters.tsx
│   │       │   ├── PropertyListFilters.tsx
│   │       │   └── propertyListAdvancedFilters.constants.ts
│   │       ├── hooks/
│   │       │   ├── propertySearchFilter.constants.ts
│   │       │   ├── usePropertyDetails.ts
│   │       │   ├── usePropertyList.ts
│   │       │   └── usePropertySearchFilters.ts
│   │       ├── mappers/
│   │       │   ├── propertyFeatures.mapper.ts
│   │       │   └── propertyList.mapper.ts
│   │       ├── mutations/
│   │       │   └── property.mutation.ts
│   │       ├── services/
│   │       │   └── property.service.ts
│   │       ├── screens/
│   │       │   ├── FavouritePropertyScreen.tsx
│   │       │   ├── InquiriesScreen.tsx
│   │       │   ├── ListingPropertyScreen.tsx
│   │       │   ├── RecentlyViewedScreen.tsx
│   │       │   ├── SavedSearchesScreen.tsx
│   │       │   ├── PropertyDetailsScreen.tsx
│   │       │   └── PropertyListScreen.tsx
│   │       ├── store/
│   │       │   └── property.store.ts
│   │       ├── types/
│   │       │   └── property.types.ts
│   │       └── utils/
│   │           └── propertyAdvancedFieldVisibility.ts
│   │   ├── saved-searches/
│   │   │   ├── components/
│   │   │   │   ├── SavedSearchFilterChips.tsx
│   │   │   │   ├── SavedSearchPopoverItem.tsx
│   │   │   │   ├── SaveSearchFiltersSummary.tsx
│   │   │   │   ├── SaveSearchForm.tsx
│   │   │   │   ├── SearchCriteriaForm.tsx
│   │   │   │   └── SearchCard.tsx
│   │   │   ├── constants/
│   │   │   │   ├── savedSearch.constants.ts
│   │   │   │   └── searchCriteriaFilter.constants.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useSavedSearchScreen.ts
│   │   │   │   ├── useSaveSearchForm.ts
│   │   │   │   ├── useSearchCriteriaForm.ts
│   │   │   │   ├── useSearchCriteriaFilters.ts
│   │   │   │   ├── useSaveSearchModal.ts
│   │   │   │   └── useSaveSearchPopover.ts
│   │   │   ├── modals/
│   │   │   │   ├── SaveSearchFormModal.tsx
│   │   │   │   └── SaveSearchModal.tsx
│   │   │   ├── mutations/
│   │   │   │   └── saved-search.mutation.ts
│   │   │   ├── popovers/
│   │   │   │   └── SaveSearchPopover.tsx
│   │   │   ├── screens/
│   │   │   │   └── SavedSearchScreen.tsx
│   │   │   ├── services/
│   │   │   │   └── saved-search.service.ts
│   │   │   ├── store/
│   │   │   ├── types/
│   │   │   │   └── savedSearch.types.ts
│   │   │   └── utils/
│   │   │       ├── buildSaveSearchCriteria.ts
│   │   │       ├── parseSavedSearchCriteriaToParams.ts
│   │   │       ├── searchCriteriaFieldVisibility.ts
│   │   │       ├── buildSavedSearchCriteriaFilterItems.ts
│   │   │       ├── buildSavedSearchFilterItems.ts
│   │   │       └── buildSavedSearchPropertyListHref.ts
│   ├── hooks/
│   │   ├── useForm.ts
│   │   ├── useMatchMedia.ts
│   │   └── useToast.tsx
│   ├── i18n/
│   │   ├── navigation.ts
│   │   ├── request.ts
│   │   └── routing.ts
│   ├── layouts/
│   │   ├── shared/
│   │   │   └── notificationsButtonStyles.ts
│   │   ├── landing-layout/
│   │   │   ├── index.tsx
│   │   │   ├── landingMobileHeaderStyles.ts
│   │   │   ├── LandingBottomTabBar.tsx
│   │   │   ├── LandingDesktopActions.tsx
│   │   │   ├── LandingDesktopNav.tsx
│   │   │   ├── LandingFooter.tsx
│   │   │   ├── LandingHeader.tsx
│   │   │   ├── LandingHeaderThemeButton.tsx
│   │   │   ├── LandingMobileMenu.tsx
│   │   │   ├── LandingMain.tsx
│   │   │   ├── LandingNotificationsButton.tsx
│   │   │   └── LandingProfilePopover.tsx
│   │   ├── protected-layout/
│   │   │   ├── hooks/
│   │   │   │   ├── useProtectedBottomTabBar.ts
│   │   │   │   ├── useProtectedHeader.ts
│   │   │   │   ├── useProtectedProfileMenu.ts
│   │   │   │   ├── useProtectedSidebar.ts
│   │   │   │   └── useProtectedSidebarNav.ts
│   │   │   ├── index.tsx
│   │   │   ├── protectedSidebarNav.config.ts
│   │   │   ├── ProtectedSidebarNav.tsx
│   │   │   ├── protectedBottomTab.config.ts
│   │   │   ├── ProtectedBottomTabBar.tsx
│   │   │   ├── ProtectedDrawer.tsx
│   │   │   ├── ProtectedFooter.tsx
│   │   │   ├── ProtectedHeader.tsx
│   │   │   ├── ProtectedProfileMenu.tsx
│   │   │   ├── ProtectedNotificationsButton.tsx
│   │   │   ├── ProtectedSearchButton.tsx
│   │   │   ├── ProtectedThemeButton.tsx
│   │   │   ├── ProtectedMain.tsx
│   │   │   ├── protectedMobileHeaderStyles.ts
│   │   │   ├── ProtectedMobileDrawer.tsx
│   │   │   ├── ProtectedMobileMenu.tsx
│   │   │   └── ProtectedSidebar.tsx
│   │   └── public-layout/
│   │       ├── index.tsx
│   │       ├── DesktopActions.tsx
│   │       ├── DesktopNav.tsx
│   │       ├── ProfilePopover.tsx
│   │       ├── publicMobileHeaderStyles.ts
│   │       ├── PublicBottomTabBar.tsx
│   │       ├── PublicFooter.tsx
│   │       ├── PublicHeader.tsx
│   │       ├── PublicHeaderThemeButton.tsx
│   │       ├── PublicMain.tsx
│   │       ├── PublicMobileMenu.tsx
│   │       └── PublicNotificationsButton.tsx
│   ├── messages/
│   │   ├── ar/
│   │   │   ├── auth.json
│   │   │   ├── common.json
│   │   │   ├── home.json
│   │   │   ├── notFound.json
│   │   │   ├── profile.json
│   │   │   ├── savedSearches.json
│   │   │   ├── unauthorized.json
│   │   │   └── index.ts
│   │   ├── en/
│   │   │   ├── auth.json
│   │   │   ├── common.json
│   │   │   ├── home.json
│   │   │   ├── notFound.json
│   │   │   ├── profile.json
│   │   │   ├── savedSearches.json
│   │   │   ├── unauthorized.json
│   │   │   └── index.ts
│   │   ├── es/
│   │   │   ├── auth.json
│   │   │   ├── common.json
│   │   │   ├── home.json
│   │   │   ├── notFound.json
│   │   │   ├── profile.json
│   │   │   ├── savedSearches.json
│   │   │   ├── unauthorized.json
│   │   │   └── index.ts
│   │   └── fr/
│   │       ├── auth.json
│   │       ├── common.json
│   │       ├── home.json
│   │       ├── notFound.json
│   │       ├── profile.json
│   │       ├── savedSearches.json
│   │       ├── unauthorized.json
│   │       └── index.ts
│   ├── providers/
│   │   ├── AuthProvider.tsx
│   │   ├── QueryProvider.tsx
│   │   ├── ReduxProvider.tsx
│   │   ├── SocketProvider.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ToastProvider.tsx
│   ├── services/
│   ├── stores/
│   ├── types/
│   │   └── toast.types.ts
│   └── utils/
└── tsconfig.json
```

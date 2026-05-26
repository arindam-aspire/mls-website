# Repository structure

High-level layout of this repository (non-excluded paths only). Update this document when the on-disk tree changes in ways that affect listed paths.

**Excluded:** `.cursor/`, `.docs/`, `.expo/`, `.git/`, `.idea/`, `.next/`, `.turbo/`, `.vercel/`, `.vscode/`, `build/`, `coverage/`, `docs/`, `node_modules/`, `out/`, `scripts/`

```text
mls_website/
├── .gitignore
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── [...rest]/
│   │   │   └── page.tsx
│   │   ├── not-found.tsx
│   │   ├── (auth)/
│   │   ├── (public)/
│   │   ├── (main)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── my-profile/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── (property)/
│   │       ├── layout.tsx
│   │       ├── favourites/
│   │       │   └── page.tsx
│   │       ├── inquiries/
│   │       │   └── page.tsx
│   │       ├── listing/
│   │       │   └── page.tsx
│   │       ├── propert-details/
│   │       ├── property-list/
│   │       ├── recently-viewed/
│   │       │   └── page.tsx
│   │       └── saved-searches/
│   │           └── page.tsx
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
│   │       ├── authEndpoints.ts
│   │       ├── index.ts
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
│   │   │   └── PasswordStrengthIndicator.tsx
│   │   └── ui/
│   │       ├── fieldVariants.ts
│   │       ├── avatar/
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       ├── button/
│   │       │   ├── index.tsx
│   │       │   └── types.ts
│   │       ├── button-group/
│   │       │   ├── index.tsx
│   │       │   └── types.ts
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
│   │       └── toggle-button/
│   │           ├── index.tsx
│   │           └── types.ts
│   ├── configs/
│   │   └── environment.config.ts
│   ├── lib/
│   │   └── cn.ts
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
│   │   │   │   ├── SocialAuthForm.tsx
│   │   │   │   ├── ForgotPasswordForm.tsx
│   │   │   │   ├── OTPVerificationForm.tsx
│   │   │   │   ├── ResetPasswordForm.tsx
│   │   │   │   ├── SignInForm.tsx
│   │   │   │   ├── SignInWithOTPForm.tsx
│   │   │   │   └── SignUpForm.tsx
│   │   │   ├── hooks/
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
│   │   │   │   └── auth.store.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   ├── dashboard/
│   │   │   └── screens/
│   │   ├── not-found/
│   │   │   └── screens/
│   │   │       └── NotFoundScreen.tsx
│   │   ├── landing/
│   │   │   ├── components/
│   │   │   │   ├── DetailsSection.tsx
│   │   │   │   ├── HeroSearchBar.tsx
│   │   │   │   └── HeroSection.tsx
│   │   │   ├── query/
│   │   │   │   └── landing.query.ts
│   │   │   ├── services/
│   │   │   │   └── landing.service.ts
│   │   │   ├── screens/
│   │   │   │   └── LandingScreen.tsx
│   │   │   ├── store/
│   │   │   └── types/
│   │   │       └── propertyTaxonomy.types.ts
│   │   ├── profile/
│   │   │   └── screens/
│   │   └── property/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── screens/
│   │       │   ├── FavouritePropertyScreen.tsx
│   │       │   ├── InquiriesScreen.tsx
│   │       │   ├── ListingPropertyScreen.tsx
│   │       │   ├── RecentlyViewedScreen.tsx
│   │       │   ├── SavedSearchesScreen.tsx
│   │       │   ├── PropertyDetailsScreen.tsx
│   │       │   └── PropertyListScreen.tsx
│   │       ├── store/
│   │       └── types/
│   ├── hooks/
│   │   ├── useForm.ts
│   │   └── useToast.tsx
│   ├── i18n/
│   │   ├── navigation.ts
│   │   ├── request.ts
│   │   └── routing.ts
│   ├── layouts/
│   │   ├── protected-layout/
│   │   └── public-layout/
│   │       ├── index.tsx
│   │       ├── DesktopActions.tsx
│   │       ├── DesktopNav.tsx
│   │       ├── ProfilePopover.tsx
│   │       ├── PublicFooter.tsx
│   │       ├── PublicHeader.tsx
│   │       ├── PublicHeaderThemeButton.tsx
│   │       └── PublicMain.tsx
│   ├── messages/
│   │   ├── ar/
│   │   │   ├── auth.json
│   │   │   ├── common.json
│   │   │   ├── home.json
│   │   │   └── index.ts
│   │   ├── en/
│   │   │   ├── auth.json
│   │   │   ├── common.json
│   │   │   ├── home.json
│   │   │   └── index.ts
│   │   ├── es/
│   │   │   ├── auth.json
│   │   │   ├── common.json
│   │   │   ├── home.json
│   │   │   └── index.ts
│   │   └── fr/
│   │       ├── auth.json
│   │       ├── common.json
│   │       ├── home.json
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

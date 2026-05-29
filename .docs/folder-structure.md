# Repository structure

High-level layout of this repository (non-excluded paths only). Update this document when the on-disk tree changes in ways that affect listed paths.

**Excluded:** `.cursor/`, `.expo/`, `.git/`, `.idea/`, `.next/`, `.turbo/`, `.vercel/`, `.vscode/`, `build/`, `coverage/`, `docs/`, `node_modules/`, `out/`, `scripts/`

**`.docs/`:** Mirrors `app/` and `src/` as markdown (`.md` per source file + folder `README.md`). Top-level indexes: `README.md`, `application.md`, `packages.md`. Regenerate scaffolding: `node scripts/bootstrap-docs.mjs`.

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
│   │       ├── (landing)/
│   │       │   ├── README.md
│   │       │   ├── layout.md
│   │       │   └── page.md
│   │       ├── (main)/
│   │       │   ├── README.md
│   │       │   ├── layout.md
│   │       │   ├── dashboard/
│   │       │   │   └── page.md
│   │       │   └── my-profile/
│   │       │       └── page.md
│   │       └── (property)/
│   │           ├── README.md
│   │           ├── layout.md
│   │           ├── favourites/
│   │           │   └── page.md
│   │           ├── inquiries/
│   │           │   └── page.md
│   │           ├── listing/
│   │           │   └── page.md
│   │           ├── property-list/
│   │           │   └── page.md
│   │           ├── recently-viewed/
│   │           │   └── page.md
│   │           └── saved-searches/
│   │               └── page.md
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
│       │   │   ├── mutations/
│       │   │   ├── screens/
│       │   │   │   └── README.md
│       │   │   ├── services/
│       │   │   ├── store/
│       │   │   └── types/
│       │   │       ├── README.md
│       │   │       ├── auth.types.md
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
│       │   ├── not-found/
│       │   ├── profile/
│       │   └── property/
│       │       ├── components/
│       │       │   ├── README.md
│       │       │   └── PropertyListFilters.md
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
│       │       └── types/
│       │           ├── README.md
│       │           └── property.types.md
│       ├── hooks/
│       ├── i18n/
│       ├── initializers/
│       ├── layouts/
│       │   ├── README.md
│       │   ├── landing-layout/
│       │   │   ├── README.md
│       │   │   ├── index.md
│       │   │   ├── LandingDesktopActions.md
│       │   │   ├── LandingDesktopNav.md
│       │   │   ├── LandingFooter.md
│       │   │   ├── LandingHeader.md
│       │   │   ├── LandingHeaderThemeButton.md
│       │   │   ├── LandingMain.md
│       │   │   └── LandingProfilePopover.md
│       │   └── public-layout/
│       │       └── README.md
│       ├── lib/
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
│   │   ├── (landing)/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── (main)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── my-profile/
│   │   │   │   └── page.tsx
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
│   │       │   └── page.tsx
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
│   │   │       ├── auth.types.ts
│   │   │       ├── forgotPassword.types.ts
│   │   │       ├── index.ts
│   │   │       ├── logout.types.ts
│   │   │       ├── signIn.types.ts
│   │   │       ├── signInOtp.types.ts
│   │   │       ├── signUp.types.ts
│   │   │       └── user.types.ts
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
│   │   │   ├── mutations/
│   │   │   │   └── landing.mutation.ts
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
│   │       │   └── PropertyListFilters.tsx
│   │       ├── hooks/
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
│   │       └── types/
│   │           └── property.types.ts
│   ├── hooks/
│   │   ├── useForm.ts
│   │   └── useToast.tsx
│   ├── i18n/
│   │   ├── navigation.ts
│   │   ├── request.ts
│   │   └── routing.ts
│   ├── layouts/
│   │   ├── landing-layout/
│   │   │   ├── index.tsx
│   │   │   ├── LandingDesktopActions.tsx
│   │   │   ├── LandingDesktopNav.tsx
│   │   │   ├── LandingFooter.tsx
│   │   │   ├── LandingHeader.tsx
│   │   │   ├── LandingHeaderThemeButton.tsx
│   │   │   ├── LandingMain.tsx
│   │   │   └── LandingProfilePopover.tsx
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

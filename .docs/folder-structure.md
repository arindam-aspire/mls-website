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
│   │   ├── (main)/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── (property)/
│   │       ├── propert-details/
│   │       └── property-list/
│   ├── globals.css
│   ├── icon.png
│   ├── layout.tsx
│   └── page.tsx
├── eslint.config.mjs
├── lib/
│   └── cn.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── proxy.ts
├── README.md
├── src/
│   ├── apis/
│   │   └── endpoints/
│   │       ├── authEndpoints.ts
│   │       ├── index.ts
│   │       └── propertyEndpoints.ts
│   ├── assets/
│   │   └── images/
│   │       ├── favicon.png
│   │       ├── icon.svg
│   │       ├── MLS_Dark_Logo.png
│   │       ├── MLS_Home_Image.png
│   │       └── MLS_Light_Logo.png
│   ├── components/
│   │   └── ui/
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
│   │       └── textarea/
│   │           ├── index.tsx
│   │           └── types.ts
│   ├── configs/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── AuthModal.tsx
│   │   │   │   ├── ForgotPasswordForm.tsx
│   │   │   │   ├── OTPVerificationForm.tsx
│   │   │   │   ├── ResetPasswordForm.tsx
│   │   │   │   ├── SignInForm.tsx
│   │   │   │   ├── SignInWithOTPForm.tsx
│   │   │   │   └── SignUpForm.tsx
│   │   │   ├── hooks/
│   │   │   ├── screens/
│   │   │   ├── store/
│   │   │   └── types/
│   │   ├── not-found/
│   │   │   └── screens/
│   │   │       └── NotFoundScreen.tsx
│   │   ├── landing/
│   │   │   ├── components/
│   │   │   │   ├── DetailsSection.tsx
│   │   │   │   ├── HeroSearchBar.tsx
│   │   │   │   └── HeroSection.tsx
│   │   │   ├── hooks/
│   │   │   ├── screens/
│   │   │   │   └── LandingScreen.tsx
│   │   │   ├── store/
│   │   │   └── types/
│   │   └── property/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── screens/
│   │       │   ├── FavouritePropertyScreen.tsx
│   │       │   ├── PropertyDetailsScreen.tsx
│   │       │   └── PropertyListScreen.tsx
│   │       ├── store/
│   │       └── types/
│   ├── hooks/
│   ├── i18n/
│   │   ├── navigation.ts
│   │   ├── request.ts
│   │   └── routing.ts
│   ├── layouts/
│   │   ├── protected-layout/
│   │   └── public-layout/
│   │       ├── index.tsx
│   │       ├── PublicFooter.tsx
│   │       ├── PublicHeader.tsx
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
│   │   └── ThemeProvider.tsx
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── utils/
└── tsconfig.json
```

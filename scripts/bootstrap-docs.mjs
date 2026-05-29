/**
 * One-shot bootstrap for .docs/ mirrored markdown.
 * Run: node scripts/bootstrap-docs.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readSrc(rel) {
  const p = path.join(ROOT, rel.replace(/^\//, ""));
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, "utf8");
}

function extractImports(content) {
  const lines = [];
  const re = /^import\s.+from\s+['"]([^'"]+)['"]/gm;
  let m;
  while ((m = re.exec(content))) {
    const mod = m[0];
    if (mod.includes("@/") || mod.includes("./") || mod.includes("../")) {
      lines.push(mod.trim());
    }
  }
  return [...new Set(lines)].slice(0, 25);
}

function extractExports(content) {
  const out = [];
  const patterns = [
    /^export\s+(?:default\s+)?(?:async\s+)?function\s+(\w+)/gm,
    /^export\s+(?:default\s+)?const\s+(\w+)/gm,
    /^export\s+(?:default\s+)?class\s+(\w+)/gm,
    /^export\s+type\s+(\w+)/gm,
    /^export\s+\{\s*([^}]+)\}/gm,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(content))) {
      if (m[1] && !m[1].includes("\n")) out.push(m[1].trim());
      else if (m[1]) {
        m[1].split(",").forEach((p) => {
          const name = p.trim().split(/\s+as\s+/).pop()?.trim();
          if (name && /^[A-Za-z_]/.test(name)) out.push(name);
        });
      }
    }
  }
  if (/export\s+default/.test(content) && !out.includes("default")) out.push("default");
  return [...new Set(out)].slice(0, 30);
}

function inferPurpose(rel, content) {
  const base = path.basename(rel);
  if (rel.includes("app/") && base === "page.tsx") {
    const route = rel
      .replace(/^app[\\/]/, "")
      .replace(/[\\/]page\.tsx$/, "")
      .replace(/\(main\)[\\/]?/g, "")
      .replace(/\(property\)[\\/]?/g, "");
    return `Next.js App Router page for route segment \`${route || "[locale]"}\`. Thin wrapper that renders a feature screen.`;
  }
  if (rel.includes("app/") && base === "layout.tsx")
    return "Next.js layout wrapping child routes with shared shell or i18n providers.";
  if (rel.includes("screens/")) return "Route-level screen component composing feature UI.";
  if (rel.includes("components/")) return "Feature or shared UI component.";
  if (rel.includes("mutations/")) return "TanStack React Query mutation hooks.";
  if (rel.includes("services/")) return "API service functions calling HTTP clients.";
  if (rel.includes("store/")) return "Zustand client store.";
  if (rel.includes("types/") || base.endsWith(".types.ts"))
    return "TypeScript types and API shape definitions.";
  if (rel.includes("apis/endpoints")) return "API path constants.";
  if (rel.includes("apis/core")) return "Axios infrastructure (tokens, interceptors, errors).";
  if (rel.includes("apis/clients")) return "HTTP client wrappers.";
  if (rel.includes("providers/")) return "React context provider.";
  if (rel.includes("hooks/")) return "Shared React hook.";
  if (rel.includes("i18n/")) return "next-intl routing, navigation, or request config.";
  if (rel.includes("messages/")) return "Locale message namespace barrel.";
  if (rel.includes("components/ui/")) return "Design-system UI primitive.";
  return "Project source module.";
}

function isClient(content) {
  return content.includes('"use client"') || content.includes("'use client'");
}

function isNa(section, rel, content) {
  if (section === "State Management") {
    if (
      rel.includes("/types/") ||
      rel.endsWith(".types.ts") ||
      rel.includes("endpoints/") ||
      rel.includes("environment.config") ||
      rel.includes("cn.ts") ||
      rel.includes("authViews.ts") ||
      rel.includes("maskContact.ts")
    )
      return true;
    if (
      section === "API Usage" &&
      (rel.includes("app/") ||
        rel.includes("components/") ||
        rel.includes("not-found") ||
        rel.includes("layouts/"))
    )
      return true;
  }
  if (section === "Navigation" && (rel.includes("types/") || rel.includes("endpoints/")))
    return true;
  if (section === "Props / Parameters" && !rel.match(/\.(tsx|ts)$/)?.[0]) return true;
  if (section === "UI Details" && !rel.match(/\.tsx$/) && !rel.includes("fieldVariants"))
    return true;
  return false;
}

function stateSection(rel, content) {
  if (isNa("State Management", rel, content)) return "_N/A — no local/global state in this module._";
  const parts = [];
  if (content.includes("useAuthStore")) parts.push("- **Zustand** `useAuthStore`");
  if (content.includes("useMutation") || content.includes("useQuery"))
    parts.push("- **TanStack Query** queries/mutations");
  if (content.includes("useState")) parts.push("- **React** `useState`");
  if (content.includes("useForm")) parts.push("- **`useForm`** hook");
  if (content.includes("createContext") || content.includes("useContext"))
    parts.push("- **React Context**");
  if (content.includes("zustand") && content.includes("create("))
    parts.push("- **Zustand** store defined in this file");
  if (content.includes("tokenStore")) parts.push("- **Cookies** via `tokenStore`");
  if (parts.length === 0) return "_No significant state; presentational or config module._";
  return parts.join("\n");
}

function apiSection(rel, content) {
  if (isNa("API Usage", rel, content)) return "_N/A._";
  if (content.includes("authClient") || content.includes("apiClient")) {
    const eps = [];
    if (content.includes("authEndpoints")) eps.push("`authEndpoints`");
    if (content.includes("publicEndpoints")) eps.push("`publicEndpoints`");
    if (content.includes("propertyEndpoints")) eps.push("`propertyEndpoints`");
    return `- Uses \`authClient\` / \`apiClient\` from \`src/apis/clients/api.client.ts\`.\n- Endpoints: ${eps.join(", ") || "see service imports"}.\n- Base URL: \`API_BASE_URL\` from \`environment.config.ts\`.`;
  }
  if (rel.includes("axios.interceptor") || rel.includes("token.refresh"))
    return "- Axios interceptors / refresh against backend auth endpoints.\n- On failure may call `navigateTo('/')`.";
  if (rel.includes("endpoints/"))
    return "- Path constants only; consumed by feature services.";
  return "_N/A unless extended._";
}

function navSection(rel, content) {
  if (isNa("Navigation", rel, content)) return "_N/A._";
  const items = [];
  if (content.includes("@/src/i18n/navigation"))
    items.push("- Use **`Link`**, **`useRouter`**, **`redirect`** from `@/src/i18n/navigation` for locale-prefixed paths (e.g. `/en/listing`).");
  if (content.includes("buildAuthModalUrl") || content.includes("AUTH_QUERY_KEY"))
    items.push("- Auth modal: query `?auth=<view>` on current pathname (see `authViews.ts`).");
  if (content.includes("navigateTo"))
    items.push("- Imperative **`navigateTo`** from `navigation.utils` (non-locale paths; used after logout).");
  if (content.includes('redirect("/en")') || content.includes("redirect('/en')"))
    items.push("- Root redirect to `/en`.");
  if (rel.includes("app/page.tsx")) items.push("- Redirects `/` → `/en`.");
  if (items.length === 0 && rel.includes("app/"))
    return "- Renders under `app/[locale]/…`; public URLs always include locale prefix.";
  return items.length ? items.join("\n") : "_No direct navigation._";
}

function uiSection(rel, content) {
  if (isNa("UI Details", rel, content)) return "_N/A._";
  const lines = [
    "- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).",
    "- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.",
    "- **Radius:** `rounded-lg` controls; `rounded-xl` cards/modals/popovers; `rounded-full` avatars/pills.",
    "- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).",
  ];
  if (content.includes("Modal")) lines.push("- Uses **`Modal`** from UI kit (`rounded-xl`).");
  if (content.includes("Headless")) lines.push("- **Headless UI** primitives where applicable.");
  return lines.join("\n");
}

function flowSection(rel, content, purpose) {
  if (rel.includes("app/") && rel.endsWith("page.tsx"))
    return `1. Next.js resolves locale-prefixed URL.\n2. Layout chain provides i18n + \`PublicLayout\` where applicable.\n3. Page default export renders the feature screen.\n4. ${purpose}`;
  if (rel.includes("AuthModal"))
    return "1. `useSearchParams` reads `auth` query key.\n2. Valid view renders matching auth screen inside `Modal`.\n3. Close clears auth query via locale-aware `useRouter`.\n4. Sign-in success callback closes modal.";
  if (rel.includes("AuthProvider"))
    return "1. On mount, if cookie access token exists and no user, set loading.\n2. `GET /auth/me` hydrates user into Zustand.\n3. On failure, `clearAuth()`.";
  if (rel.includes("mutation"))
    return "1. Component calls mutation hook.\n2. Service hits API via `authClient`.\n3. `onSuccess` / `onError` update store and toasts.\n4. Logout redirects to `/${locale}`.";
  return `See source in \`${rel}\` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).`;
}

function actionsInputsSection(rel, content) {
  const actions = new Set();
  const inputs = new Set();

  const validationsByField = new Map();
  const validationRulesByField = new Map();
  const showHideControls = new Set();

  const addValidationRule = (field, rule) => {
    if (!validationRulesByField.has(field)) validationRulesByField.set(field, new Set());
    validationRulesByField.get(field).add(rule);
  };

  // Inputs: best-effort from useForm initialValues keys
  const initialValuesMatch = content.match(/initialValues\s*:\s*\{([\s\S]*?)\}\s*,/m);
  if (initialValuesMatch?.[1]) {
    const obj = initialValuesMatch[1];
    [...obj.matchAll(/([A-Za-z0-9_]+)\s*:/g)].forEach((m) => inputs.add(m[1]));
  }

  // Fallback: extract <Input name="..."> props (including plain HTML input)
  [...content.matchAll(/name\s*=\s*["']([^"']+)["']/g)].forEach((m) => inputs.add(m[1]));

  // Fallback: extract values.<field> usage
  [...content.matchAll(/values\.([A-Za-z0-9_]+)/g)].forEach((m) => inputs.add(m[1]));

  // Actions: submit form
  if (content.includes("onSubmit") && content.includes("handleSubmit")) actions.add("Submit form");

  // Password visibility toggle / show-hide control
  if (/setShowPassword\s*\(/.test(content) || /\bshowPassword\b/.test(content)) {
    actions.add("Toggle password visibility");
    showHideControls.add(
      "Password visibility toggles via `showPassword` state (eye icon controls input `type`).",
    );
  }

  // Auth modal navigation: openAuthView(AUTH_VIEW.X, ...)
  if (content.includes("openAuthView(") && content.includes("AUTH_VIEW.")) {
    [...content.matchAll(/openAuthView\(\s*AUTH_VIEW\.([A-Za-z0-9_]+)\s*,/g)].forEach((m) => {
      actions.add(`Open auth view: ${m[1]}`);
    });
  }

  // Sign-in method switcher (email/phone)
  if (content.includes("ToggleButton") && content.includes("method")) {
    actions.add("Switch sign-in method (email/phone or similar)");
  }

  // Sign-in submit callback (button click / form submit)
  if (content.includes("onClickSignIn")) actions.add("Trigger sign-in callback");

  // Imperative navigation and menu interactions
  if (content.includes("router.push(") && content.includes("close();")) {
    actions.add("Navigate and close popover/menu");
  }
  if (content.includes("useClose") && content.includes("close();")) {
    actions.add("Close popover/menu");
  }

  // Explicit validations (best-effort)
  // Capture: nextErrors.<field> = t("<translation_key>")
  for (const m of content.matchAll(
    /nextErrors\.([A-Za-z0-9_]+)\s*=\s*t\(\s*["']([^"']+)["']\s*\)/g,
  )) {
    const field = m[1];
    const key = m[2];
    if (!validationsByField.has(field)) validationsByField.set(field, new Set());
    validationsByField.get(field).add(key);
  }

  // Handle helper functions like getPhoneError() used in nextErrors assignments
  const getPhoneErrorMatch = content.match(
    /getPhoneError\s*=\s*\([^)]*\)\s*=>\s*\{([\s\S]*?)\n\};?/m,
  );
  if (getPhoneErrorMatch?.[1]) {
    const phoneErrorKeys = new Set(
      [...getPhoneErrorMatch[1].matchAll(/t\(\s*["']([^"']+)["']\s*\)/g)].map((mm) => mm[1]),
    );

    for (const gm of content.matchAll(/nextErrors\.([A-Za-z0-9_]+)\s*=\s*getPhoneError\(/g)) {
      const field = gm[1];
      if (!validationsByField.has(field)) validationsByField.set(field, new Set());
      phoneErrorKeys.forEach((k) => validationsByField.get(field).add(k));
    }
  }

  // Infer explicit rule statements from condition checks in validate/helper functions
  // required checks
  for (const m of content.matchAll(/if\s*\(\s*!\s*formValues\.([A-Za-z0-9_]+)\s*(?:\?\.)?\.?trim\(\)\s*\)/g)) {
    addValidationRule(m[1], "Required (non-empty)");
  }
  for (const m of content.matchAll(/if\s*\(\s*!\s*formValues\.([A-Za-z0-9_]+)\s*\)/g)) {
    addValidationRule(m[1], "Required");
  }

  // email pattern checks
  for (const m of content.matchAll(
    /if\s*\(\s*!\s*[A-Za-z0-9_]+\.test\(\s*formValues\.([A-Za-z0-9_]+)\s*(?:\?\.)?\.?trim\(\)\s*\)\s*\)/g,
  )) {
    addValidationRule(m[1], "Must match email format");
  }

  // digit length checks (phone-like fields)
  for (const m of content.matchAll(
    /if\s*\(\s*formValues\.([A-Za-z0-9_]+)\.replace\([^)]*\)\.length\s*<\s*(\d+)\s*\)/g,
  )) {
    addValidationRule(m[1], `Minimum ${m[2]} digits`);
  }

  // generic length checks
  for (const m of content.matchAll(/if\s*\(\s*formValues\.([A-Za-z0-9_]+)\.length\s*<\s*(\d+)\s*\)/g)) {
    addValidationRule(m[1], `Minimum length ${m[2]}`);
  }
  for (const m of content.matchAll(/if\s*\(\s*formValues\.([A-Za-z0-9_]+)\.length\s*>\s*(\d+)\s*\)/g)) {
    addValidationRule(m[1], `Maximum length ${m[2]}`);
  }

  const inputsList = inputs.size
    ? [...inputs].sort().map((i) => `- \`${i}\``).join("\n")
    : "_No explicit inputs detected._";

  const actionsList = actions.size
    ? [...actions].sort().map((a) => `- ${a}`).join("\n")
    : "_No explicit actions detected._";

  const validationsList = validationsByField.size || validationRulesByField.size
    ? [...new Set([...validationsByField.keys(), ...validationRulesByField.keys()])]
        .sort((a, b) => a.localeCompare(b))
        .map((field) => {
          const keys = validationsByField.get(field) ?? new Set();
          const rules = validationRulesByField.get(field) ?? new Set();
          const sortedKeys = [...keys].sort();
          const sortedRules = [...rules].sort();
          const rulesLine = sortedRules.length
            ? `  - Rules: ${sortedRules.map((r) => `\`${r}\``).join(", ")}`
            : "  - Rules: _Not auto-detected_";
          const keysLine = sortedKeys.length
            ? `  - Message keys: ${sortedKeys.map((k) => `\`${k}\``).join(", ")}`
            : "  - Message keys: _None detected_";
          return `- \`${field}\`\n${rulesLine}\n${keysLine}`;
        })
        .join("\n")
    : "_No explicit validations detected._";

  const showHideList = showHideControls.size
    ? [...showHideControls].sort().map((s) => `- ${s}`).join("\n")
    : "_No explicit show/hide controls detected._";

  return `## Inputs\n\n${inputsList}\n\n## Actions\n\n${actionsList}\n\n## Validations\n\n${validationsList}\n\n## Show/Hide Controls\n\n${showHideList}`;
}

function generateFileDoc(rel) {
  const content = readSrc(rel);
  if (!content) return null;
  const purpose = inferPurpose(rel, content);
  const imports = extractImports(content);
  const exports = extractExports(content);
  const docRel = rel
    .replace(/^app[\\/]/, "app/")
    .replace(/^src[\\/]/, "src/")
    .replace(/\.tsx$/, ".md")
    .replace(/\.ts$/, ".md");
  const docPath = path.join(ROOT, ".docs", docRel);

  const sections = `# File Overview

${purpose}

**Source:** \`${rel}\`${isClient(content) ? " (Client Component)" : ""}

# Responsibilities

- ${purpose}

# Imports

${imports.length ? imports.map((i) => `- \`${i}\``).join("\n") : "_No notable imports._"}

# Exports

${exports.length ? exports.map((e) => `- \`${e}\``).join("\n") : "_See source exports._"}

# State Management

${stateSection(rel, content)}

# API Usage

${apiSection(rel, content)}

# Navigation

${navSection(rel, content)}

# Props / Parameters

${rel.endsWith(".tsx") ? "- See component/handler props in source (TypeScript interfaces)." : "_N/A — non-component module._"}

# Actions / Inputs

${actionsInputsSection(rel, content)}

# UI Details

${uiSection(rel, content)}

# Flow Description

${flowSection(rel, content, purpose)}

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when \`${rel}\` changes.
`;

  fs.mkdirSync(path.dirname(docPath), { recursive: true });
  fs.writeFileSync(docPath, sections);
  return docPath;
}

const FILE_LIST = [
  // app
  "app/layout.tsx",
  "app/page.tsx",
  "app/loading.tsx",
  "app/[locale]/layout.tsx",
  "app/[locale]/not-found.tsx",
  "app/[locale]/[...rest]/page.tsx",
  "app/[locale]/(landing)/layout.tsx",
  "app/[locale]/(landing)/page.tsx",
  "app/[locale]/(main)/layout.tsx",
  "app/[locale]/(main)/dashboard/page.tsx",
  "app/[locale]/(main)/my-profile/page.tsx",
  "app/[locale]/(property)/layout.tsx",
  "app/[locale]/(property)/listing/page.tsx",
  "app/[locale]/(property)/property-list/page.tsx",
  "app/[locale]/(property)/favourites/page.tsx",
  "app/[locale]/(property)/saved-searches/page.tsx",
  "app/[locale]/(property)/recently-viewed/page.tsx",
  "app/[locale]/(property)/inquiries/page.tsx",
  // layouts
  "src/layouts/landing-layout/index.tsx",
  "src/layouts/landing-layout/LandingHeader.tsx",
  "src/layouts/landing-layout/LandingMain.tsx",
  "src/layouts/landing-layout/LandingFooter.tsx",
  "src/layouts/landing-layout/LandingDesktopNav.tsx",
  "src/layouts/landing-layout/LandingDesktopActions.tsx",
  "src/layouts/landing-layout/LandingProfilePopover.tsx",
  "src/layouts/landing-layout/LandingHeaderThemeButton.tsx",
  "src/layouts/public-layout/index.tsx",
  "src/layouts/public-layout/PublicHeader.tsx",
  "src/layouts/public-layout/PublicMain.tsx",
  "src/layouts/public-layout/PublicFooter.tsx",
  "src/layouts/public-layout/DesktopNav.tsx",
  "src/layouts/public-layout/DesktopActions.tsx",
  "src/layouts/public-layout/ProfilePopover.tsx",
  "src/layouts/public-layout/PublicHeaderThemeButton.tsx",
  // providers
  "src/providers/AuthProvider.tsx",
  "src/providers/ThemeProvider.tsx",
  "src/providers/QueryProvider.tsx",
  "src/providers/ToastProvider.tsx",
  "src/providers/ReduxProvider.tsx",
  "src/providers/SocketProvider.tsx",
  // initializers, i18n, hooks, configs, lib, utils
  "src/initializers/NavigationInitializer.tsx",
  "src/i18n/routing.ts",
  "src/i18n/navigation.ts",
  "src/i18n/request.ts",
  "src/hooks/useForm.ts",
  "src/hooks/useToast.tsx",
  "src/configs/environment.config.ts",
  "src/lib/cn.ts",
  "src/utils/navigation.utils.ts",
  // apis
  "src/apis/clients/api.client.ts",
  "src/apis/core/axios.factory.ts",
  "src/apis/core/axios.interceptor.ts",
  "src/apis/core/token.store.ts",
  "src/apis/core/token.refresh.ts",
  "src/apis/core/error.normalizer.ts",
  "src/apis/endpoints/authEndpoints.ts",
  "src/apis/endpoints/publicEndpoints.ts",
  "src/apis/endpoints/propertyEndpoints.ts",
  "src/apis/endpoints/index.ts",
  // common
  "src/components/common/ComingSoonCard.tsx",
  "src/components/common/ConfirmModal.tsx",
  "src/components/common/PasswordStrengthIndicator.tsx",
  // auth root
  "src/features/auth/authViews.ts",
  "src/features/auth/maskContact.ts",
  "src/features/auth/mutations/auth.mutation.ts",
  "src/features/auth/services/auth.service.ts",
  "src/features/auth/store/auth.store.ts",
  "src/features/auth/types/auth.types.ts",
  "src/features/auth/types/index.ts",
  "src/features/auth/types/signUp.types.ts",
  "src/features/auth/types/signIn.types.ts",
  "src/features/auth/types/signInOtp.types.ts",
  "src/features/auth/types/forgotPassword.types.ts",
  "src/features/auth/types/user.types.ts",
  "src/features/auth/types/logout.types.ts",
  // auth components
  "src/features/auth/components/AccountTypeCard.tsx",
  "src/features/auth/components/AgencyAuthForm.tsx",
  "src/features/auth/components/AgencySignUpForm.tsx",
  "src/features/auth/components/AuthModal.tsx",
  "src/features/auth/components/AuthModalHeader.tsx",
  "src/features/auth/components/ChooseAccountForm.tsx",
  "src/features/auth/components/ForgotPasswordForm.tsx",
  "src/features/auth/components/OTPVerificationForm.tsx",
  "src/features/auth/components/ResetPasswordForm.tsx",
  "src/features/auth/components/SignInForm.tsx",
  "src/features/auth/components/SignInWithOTPForm.tsx",
  "src/features/auth/components/SignUpForm.tsx",
  "src/features/auth/components/SocialAuthForm.tsx",
  // auth screens
  "src/features/auth/screens/AccountChooseScreen.tsx",
  "src/features/auth/screens/AgencyEmailSignInScreen.tsx",
  "src/features/auth/screens/AgencyRegistrationScreen.tsx",
  "src/features/auth/screens/AgencySignInScreen.tsx",
  "src/features/auth/screens/ConfirmSignUpScreen.tsx",
  "src/features/auth/screens/ForgotPasswordScreen.tsx",
  "src/features/auth/screens/OTPVerificationScreen.tsx",
  "src/features/auth/screens/ResetPasswordScreen.tsx",
  "src/features/auth/screens/SignInScreen.tsx",
  "src/features/auth/screens/SignInWithOTPScreen.tsx",
  "src/features/auth/screens/SocialRegistrationScreen.tsx",
  "src/features/auth/screens/SocialSignInScreen.tsx",
  "src/features/auth/screens/UserRegistrationScreen.tsx",
  // landing
  "src/features/landing/screens/LandingScreen.tsx",
  "src/features/landing/components/HeroSection.tsx",
  "src/features/landing/components/HeroSearchBar.tsx",
  "src/features/landing/components/DetailsSection.tsx",
  "src/features/landing/mutations/landing.mutation.ts",
  "src/features/landing/services/landing.service.ts",
  "src/features/landing/types/propertyTaxonomy.types.ts",
  // property screens
  "src/features/property/mutations/property.mutation.ts",
  "src/features/property/services/property.service.ts",
  "src/features/property/store/property.store.ts",
  "src/features/property/screens/PropertyListScreen.tsx",
  "src/features/property/screens/PropertyDetailsScreen.tsx",
  "src/features/property/screens/ListingPropertyScreen.tsx",
  "src/features/property/screens/FavouritePropertyScreen.tsx",
  "src/features/property/screens/SavedSearchesScreen.tsx",
  "src/features/property/screens/RecentlyViewedScreen.tsx",
  "src/features/property/screens/InquiriesScreen.tsx",
  // other features
  "src/features/dashboard/screens/index.tsx",
  "src/features/profile/screens/index.tsx",
  "src/features/not-found/screens/NotFoundScreen.tsx",
  // messages
  "src/messages/en/index.ts",
  "src/messages/ar/index.ts",
  "src/messages/es/index.ts",
  "src/messages/fr/index.ts",
  // ui
  "src/components/ui/index.tsx",
  "src/components/ui/fieldVariants.ts",
  "src/components/ui/avatar/index.tsx",
  "src/components/ui/avatar/types.ts",
  "src/components/ui/button/index.tsx",
  "src/components/ui/button/types.ts",
  "src/components/ui/button-group/index.tsx",
  "src/components/ui/button-group/types.ts",
  "src/components/ui/card/index.tsx",
  "src/components/ui/card/types.ts",
  "src/components/ui/icon-button/index.tsx",
  "src/components/ui/icon-button/types.ts",
  "src/components/ui/input/index.tsx",
  "src/components/ui/input/types.ts",
  "src/components/ui/link/index.tsx",
  "src/components/ui/link/types.ts",
  "src/components/ui/modal/index.tsx",
  "src/components/ui/modal/types.ts",
  "src/components/ui/phone-input/index.tsx",
  "src/components/ui/phone-input/types.ts",
  "src/components/ui/phone-input/countries.ts",
  "src/components/ui/popover/index.tsx",
  "src/components/ui/popover/types.ts",
  "src/components/ui/select/index.tsx",
  "src/components/ui/select/types.ts",
  "src/components/ui/select-dropdown/index.tsx",
  "src/components/ui/select-dropdown/types.ts",
  "src/components/ui/skeleton/index.tsx",
  "src/components/ui/skeleton/types.ts",
  "src/components/ui/textarea/index.tsx",
  "src/components/ui/textarea/types.ts",
  "src/components/ui/toaster/index.tsx",
  "src/components/ui/toaster/types.ts",
  "src/components/ui/toaster/ToastIcons.tsx",
  "src/components/ui/toggle-button/index.tsx",
  "src/components/ui/toggle-button/types.ts",
];

const created = [];
for (const rel of FILE_LIST) {
  const out = generateFileDoc(rel);
  if (out) created.push(path.relative(ROOT, out));
  else console.warn("MISSING:", rel);
}

console.log(`Generated ${created.length} per-file docs.`);

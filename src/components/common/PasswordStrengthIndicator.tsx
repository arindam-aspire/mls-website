"use client";

import { Check, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { cn } from "@/src/lib/cn";

type PasswordRule = {
  key: string;
  label: string;
  test: (password: string) => boolean;
};

type StrengthLevel = {
  label: string;
  /** Inline CSS color for the label text */
  color: string;
  /** Inline CSS color for the progress bar */
  barColor: string;
  fraction: number;
};

function getPasswordRules(t: (key: string) => string): PasswordRule[] {
  return [
    {
      key: "minLength",
      label: t("passwordRuleMinLength"),
      test: (pw) => pw.length >= 8,
    },
    {
      key: "maxLength",
      label: t("passwordRuleMaxLength"),
      test: (pw) => pw.length > 0 && pw.length <= 20,
    },
    {
      key: "uppercase",
      label: t("passwordRuleUppercase"),
      test: (pw) => /[A-Z]/.test(pw),
    },
    {
      key: "lowercase",
      label: t("passwordRuleLowercase"),
      test: (pw) => /[a-z]/.test(pw),
    },
    {
      key: "number",
      label: t("passwordRuleNumber"),
      test: (pw) => /\d/.test(pw),
    },
    {
      key: "special",
      label: t("passwordRuleSpecial"),
      test: (pw) => /[^A-Za-z0-9_]/.test(pw),
    },
  ];
}

// 0-2 → Weak, 3-4 → Medium, 5 → Strong, 6 → Very Strong
function getStrengthLevel(
  passedCount: number,
  total: number,
  t: (key: string) => string,
): StrengthLevel {
  const fraction = passedCount / total;

  if (passedCount <= 2)
    return {
      label: t("passwordStrengthWeak"),
      color: "var(--danger)",
      barColor: "var(--danger)",
      fraction,
    };
  if (passedCount <= 4)
    return {
      label: t("passwordStrengthMedium"),
      color: "#f59e0b",
      barColor: "#f59e0b",
      fraction,
    };
  if (passedCount < total)
    return {
      label: t("passwordStrengthStrong"),
      color: "var(--success)",
      barColor: "var(--success)",
      fraction,
    };

  return {
    label: t("passwordStrengthVeryStrong"),
    color: "var(--success)",
    barColor: "var(--success)",
    fraction: 1,
  };
}

type PasswordStrengthIndicatorProps = {
  password: string;
};

export function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const t = useTranslations("auth");
  const [isOpen, setIsOpen] = useState(false);

  const rules = useMemo(() => getPasswordRules(t), [t]);

  const results = useMemo(
    () => rules.map((rule) => ({ ...rule, passed: rule.test(password) })),
    [rules, password],
  );

  const passedCount = results.filter((r) => r.passed).length;
  const strength = getStrengthLevel(passedCount, rules.length, t);
  const failedRules = results.filter((r) => !r.passed);

  if (!password) return null;

  return (
    <div className="rounded-xl border border-secondary/15 bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text">
          {t("passwordStrength")}
        </span>
        <span
          className="text-sm font-semibold"
          style={{ color: strength.color }}
        >
          {strength.label}
        </span>
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary/10">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${strength.fraction * 100}%`,
            backgroundColor: strength.barColor,
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="mt-3 flex w-full items-center justify-between text-sm text-muted transition-colors hover:text-text"
      >
        <span>
          {isOpen
            ? t("passwordHideRequirements")
            : t("passwordShowRequirements")}
        </span>
        <ChevronDown
          className={cn(
            "size-4 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div className="mt-3">
          <p className="mb-2 text-sm font-semibold text-text">
            {t("passwordRequirementsTitle")}
          </p>
          <ul className="space-y-1.5">
            {results.map((rule) => (
              <li key={rule.key} className="flex items-center gap-2 text-sm">
                {rule.passed ? (
                  <Check
                    className="size-4 shrink-0 text-success"
                    aria-hidden
                  />
                ) : (
                  <span
                    className="flex size-4 shrink-0 items-center justify-center"
                    aria-hidden
                  >
                    <span className="size-2 rounded-full bg-secondary/40" />
                  </span>
                )}
                <span
                  className={cn(
                    rule.passed ? "text-success" : "text-text",
                  )}
                >
                  {rule.label}
                </span>
              </li>
            ))}
          </ul>

          {failedRules.length > 0 && (
            <p className="mt-3 text-xs text-muted">
              {t("passwordStrengthHint", {
                rules: failedRules.map((r) => r.label).join(", "),
              })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

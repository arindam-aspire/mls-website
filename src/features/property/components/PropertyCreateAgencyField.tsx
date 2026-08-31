"use client";

import { Button, Card, CheckboxField, Select } from "@/src/components/ui";
import type { SelectOption } from "@/src/components/ui/select/types";
import { Building2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type PropertyCreateAgencyFieldProps = {
  sectionTitle: string;
  routingQuestion: string;
  routeThroughAgency: boolean;
  onRouteThroughAgencyChange: (checked: boolean) => void;
  label: string;
  placeholder: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  routingDisabled?: boolean;
  disabled?: boolean;
  isRequired?: boolean;
  retryLabel?: string;
  onRetry?: () => void;
};

export function PropertyCreateAgencyField({
  sectionTitle,
  routingQuestion,
  routeThroughAgency,
  onRouteThroughAgencyChange,
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
  hint,
  routingDisabled = false,
  disabled = false,
  isRequired = true,
  retryLabel,
  onRetry,
}: PropertyCreateAgencyFieldProps) {
  const sourceAnchorRef = useRef<HTMLSpanElement | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = sourceAnchorRef.current?.parentElement;

    if (!root) {
      return;
    }

    let target: HTMLDivElement | null = null;

    const mountBeforeTerms = () => {
      const termsCheckbox = root.querySelector<HTMLInputElement>(
        'input[name="terms_accept_all"]',
      );
      const termsCard = termsCheckbox?.closest<HTMLElement>('[data-slot="card"]');
      const termsContainer = termsCard?.parentElement;

      if (!termsCard || !termsContainer || target) {
        return;
      }

      target = document.createElement("div");
      target.dataset.propertyAgencyRoutingPortal = "true";
      termsContainer.insertBefore(target, termsCard);
      setPortalTarget(target);
    };

    mountBeforeTerms();

    const observer = new MutationObserver(mountBeforeTerms);
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      target?.remove();
    };
  }, []);

  return (
    <>
      <span ref={sourceAnchorRef} hidden aria-hidden />
      {portalTarget
        ? createPortal(
            <Card className="border border-secondary/10 bg-page p-4 sm:p-5">
              <h3 className="mb-4 text-xs font-bold tracking-[0.08em] text-secondary uppercase sm:text-sm">
                <span className="inline-flex items-center gap-2">
                  <Building2 className="size-5 shrink-0 text-secondary" aria-hidden />
                  {sectionTitle}
                </span>
              </h3>

              <CheckboxField
                id="route-through-agency"
                name="route_through_agency"
                label={routingQuestion}
                checked={routeThroughAgency}
                onChange={onRouteThroughAgencyChange}
                disabled={routingDisabled}
                labelClassName="overflow-visible whitespace-normal [text-overflow:clip]"
              />

              {routeThroughAgency ? (
                <div className="mt-4 border-t border-secondary/10 pt-4">
                  <div className="grid grid-cols-1 gap-3 md:max-w-md">
                    <Select
                      label={label}
                      placeholder={placeholder}
                      options={options}
                      value={value}
                      onChange={onChange}
                      error={error}
                      hint={hint}
                      disabled={disabled}
                      isRequired={isRequired}
                      fullWidth
                    />
                    {onRetry && retryLabel ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onRetry}
                        className="w-full sm:w-auto"
                      >
                        {retryLabel}
                      </Button>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </Card>,
            portalTarget,
          )
        : null}
    </>
  );
}

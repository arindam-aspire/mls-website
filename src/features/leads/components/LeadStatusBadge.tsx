import { cn } from "@/src/lib/cn";
import { LEAD_STATUS_BADGE_CLASS } from "../constants/leadStatus.constants";
import { resolveLeadStatus } from "../utils/leadDisplay.utils";

const BADGE_BASE_CLASSNAME =
  "inline-flex w-fit max-w-max shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold sm:px-3 sm:text-xs";

type LeadStatusBadgeProps = {
  status: string;
  label: string;
};

export function LeadStatusBadge({ status, label }: LeadStatusBadgeProps) {
  const resolved = resolveLeadStatus(status);
  const colorClass = resolved
    ? LEAD_STATUS_BADGE_CLASS[resolved]
    : "border-secondary/20 bg-secondary/10 text-muted";

  return (
    <span className={cn(BADGE_BASE_CLASSNAME, colorClass)}>{label}</span>
  );
}

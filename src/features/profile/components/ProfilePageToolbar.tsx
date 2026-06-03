import { Lock } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";

export type ProfilePageToolbarProps = {
  title: string;
  subtitle: string;
  changePasswordLabel: string;
  onChangePassword: () => void;
};

export function ProfilePageToolbar({
  title,
  subtitle,
  changePasswordLabel,
  onChangePassword,
}: ProfilePageToolbarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between md:gap-4 lg:gap-6">
      <div className="min-w-0 flex-1">
        <h1 className={headingPageClasses}>{title}</h1>
        <p className={cn("text-muted", bodyLargeTextClasses)}>{subtitle}</p>
      </div>

      <Button
        type="button"
        color="inherit"
        variant="outline"
        size="sm"
        iconStart={<Lock className="size-4" aria-hidden />}
        className="w-full rounded-lg sm:w-auto"
        onClick={onChangePassword}
      >
        {changePasswordLabel}
      </Button>
    </div>
  );
}

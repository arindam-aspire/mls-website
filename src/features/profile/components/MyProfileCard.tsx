import { CheckCircle, Mail, Pencil, Phone, Trash2, XCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";
import {
  headingSectionClasses,
  profileEmailClasses,
  profileNameClasses,
} from "@/src/lib/typography";
import type { MyProfileCardProps, ProfileInfoField } from "../types/profile.types";
import { ProfileAvatarUpload } from "./ProfileAvatarUpload";

type ProfileFieldProps = ProfileInfoField & {
  verifiedLabel: string;
  notVerifiedLabel: string;
};

function ProfileField({
  label,
  value,
  kind = "default",
  verified,
  verifiedLabel,
  notVerifiedLabel,
}: ProfileFieldProps) {
  if (kind === "email" || kind === "phone") {
    const Icon = kind === "email" ? Mail : Phone;
    const isVerified = verified ?? false;
    const showVerification = verified !== undefined;

    return (
      <div className="flex min-w-0 items-start justify-center gap-3 md:justify-start">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            "bg-primary/10 text-primary",
          )}
        >
          <Icon className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 text-center md:text-start">
          <dt className="text-xs font-medium text-muted">{label}</dt>
          <dd className="mt-1 truncate text-sm font-medium text-text">{value}</dd>
          {showVerification ? (
            <dd className="mt-1">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium",
                  isVerified ? "bg-success/15 text-success" : "bg-danger/10 text-danger",
                )}
              >
                {isVerified ? (
                  <CheckCircle className="size-3.5 shrink-0" aria-hidden />
                ) : (
                  <XCircle className="size-3.5 shrink-0" aria-hidden />
                )}
                {isVerified ? verifiedLabel : notVerifiedLabel}
              </span>
            </dd>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 text-center md:text-start">
      <dt className="text-xs font-medium text-muted">{label}</dt>
      <dd className="mt-1 truncate text-sm font-medium text-text">{value}</dd>
    </div>
  );
}

export function MyProfileCard({
  user,
  roleLabel,
  sectionTitle,
  fields,
  uploadPhotoLabel,
  onUploadProfilePhoto,
  editLabel,
  onEdit,
  removeImageLabel,
  onRemoveProfilePhoto,
  verifiedLabel,
  notVerifiedLabel,
}: MyProfileCardProps) {
  const hasProfileImage = Boolean(user.profile_picture_url?.trim());

  const compactGhostButtonClass =
    "!h-7 !min-h-7 !gap-1 !rounded-lg !px-2 !py-0 !text-xs sm:!h-7 lg:!h-7 [&_span[aria-hidden]]:!size-3 [&_span[aria-hidden]_svg]:!size-3";

  return (
    <div className="flex w-full justify-center">
      <article className="w-full max-w-md rounded-xl border border-secondary/15 bg-page p-4 sm:p-6">
        <div className="flex flex-col items-center gap-2 text-center md:flex-row md:items-center md:gap-4 md:text-start lg:gap-6">
          <ProfileAvatarUpload
            src={user.profile_picture_url}
            name={user.full_name}
            uploadLabel={uploadPhotoLabel}
            onUploadClick={onUploadProfilePhoto}
          />
          <div className="flex min-w-0 flex-col items-center md:items-start">
            <p className={cn(profileNameClasses, "text-base sm:text-lg")}>{user.full_name}</p>
            <p className={cn("text-muted", profileEmailClasses)}>{roleLabel}</p>
            <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1 md:justify-start">
              <Button
                type="button"
                color="secondary"
                variant="ghost"
                size="sm"
                iconStart={<Pencil className="size-3" aria-hidden />}
                className={compactGhostButtonClass}
                onClick={onEdit}
              >
                {editLabel}
              </Button>
              {hasProfileImage && removeImageLabel && onRemoveProfilePhoto ? (
                <Button
                  type="button"
                  color="danger"
                  variant="ghost"
                  size="sm"
                  iconStart={<Trash2 className="size-3" aria-hidden />}
                  className={compactGhostButtonClass}
                  onClick={onRemoveProfilePhoto}
                >
                  {removeImageLabel}
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <h2 className={cn("mt-4 text-center sm:mt-6 md:text-start", headingSectionClasses)}>
          {sectionTitle}
        </h2>
        <dl className="mt-2 flex flex-col gap-2 md:gap-4 lg:gap-6">
          {fields.map((field) => (
            <ProfileField
              key={field.label}
              {...field}
              verifiedLabel={verifiedLabel}
              notVerifiedLabel={notVerifiedLabel}
            />
          ))}
        </dl>
      </article>
    </div>
  );
}

export type { MyProfileCardProps };

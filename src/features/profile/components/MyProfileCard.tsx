import {
  CheckCircle,
  Mail,
  Pencil,
  Phone,
  Shield,
  User,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { IconButton } from "@/src/components/ui/icon-button";
import { cn } from "@/src/lib/cn";
import { headingSectionClasses } from "@/src/lib/typography";
import type {
  MyProfileCardProps,
  ProfileInfoField,
  ProfileInfoFieldKind,
} from "../types/profile.types";
import { ProfileAvatarUpload } from "./ProfileAvatarUpload";

const FIELD_ICONS: Record<ProfileInfoFieldKind, LucideIcon> = {
  name: User,
  role: Shield,
  email: Mail,
  phone: Phone,
};

type ProfileFieldProps = ProfileInfoField & {
  verifiedLabel: string;
  notVerifiedLabel: string;
};

function ProfileFieldIcon({
  icon: Icon,
}: {
  icon: LucideIcon;
}) {
  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg",
        "bg-primary/10 text-primary",
      )}
    >
      <Icon className="size-5" aria-hidden />
    </div>
  );
}

function ProfileField({
  label,
  value,
  kind = "name",
  verified,
  editLabel,
  onEdit,
  verifiedLabel,
  notVerifiedLabel,
}: ProfileFieldProps) {
  const Icon = FIELD_ICONS[kind];
  const isVerified = verified ?? false;
  const showVerification =
    (kind === "email" || kind === "phone") && verified !== undefined;
  const showEdit = (kind === "email" || kind === "phone") && editLabel && onEdit;

  return (
    <div className="flex min-w-0 items-start gap-3">
      <ProfileFieldIcon icon={Icon} />
      <div className="min-w-0 flex-1 text-start">
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
      {showEdit ? (
        <IconButton
          type="button"
          icon={<Pencil className="size-4" aria-hidden />}
          aria-label={editLabel}
          color="secondary"
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="mt-0.5 shrink-0 rounded-lg"
        />
      ) : null}
    </div>
  );
}

export function MyProfileCard({
  user,
  sectionTitle,
  fields,
  uploadPhotoLabel,
  avatarUpload,
  removeImageLabel,
  photoHint,
  verifiedLabel,
  notVerifiedLabel,
}: MyProfileCardProps) {
  const hasProfileImage = Boolean(user.profile_picture_url?.trim());

  return (
    <div className="flex w-full justify-center">
      <article className="w-full max-w-md rounded-xl border border-secondary/15 bg-page p-4 sm:p-6">
        <ProfileAvatarUpload
          src={user.profile_picture_url}
          name={user.full_name}
          uploadLabel={uploadPhotoLabel}
          uploadingLabel={avatarUpload.uploadingLabel}
          removeLabel={removeImageLabel}
          photoHint={photoHint}
          onUploadClick={avatarUpload.onUploadClick}
          onRemoveClick={avatarUpload.onRemoveClick}
          canRemove={hasProfileImage}
          removingLabel={avatarUpload.removingLabel}
          fileInputRef={avatarUpload.fileInputRef}
          onFileChange={avatarUpload.onFileChange}
          isUploading={avatarUpload.isUploading}
          isRemoving={avatarUpload.isRemoving}
        />

        <h2 className={cn("mt-6 text-center sm:mt-8 md:text-start", headingSectionClasses)}>
          {sectionTitle}
        </h2>
        <dl className="mt-3 flex flex-col gap-4 md:gap-5">
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

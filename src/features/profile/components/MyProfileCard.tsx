import {
  Mail,
  Pencil,
  Phone,
  Shield,
  User,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/src/components/ui";
import { IconButton } from "@/src/components/ui/icon-button";
import { cn } from "@/src/lib/cn";
import { headingSectionClasses } from "@/src/lib/typography";
import type {
  MyProfileCardProps,
  ProfileInfoField,
  ProfileInfoFieldKind,
} from "../types/profile.types";
import { ProfileAvatarUpload } from "./ProfileAvatarUpload";
import { ProfileVerificationStatus } from "./ProfileVerificationStatus";

const profileCardClassName = "w-full md:max-w-md sm:max-w-none md:mx-auto lg:mx-0";

const FIELD_ICONS: Record<ProfileInfoFieldKind, LucideIcon> = {
  name: User,
  role: Shield,
  email: Mail,
  phone: Phone,
};

type ProfileFieldProps = ProfileInfoField & {
  verifiedLabel: string;
  notVerifiedLabel: string;
  verifyLoadingLabel: string;
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
        "bg-black/5 text-black/70 dark:bg-white/5 dark:text-white/70",
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
  verifyLabel,
  onVerify,
  isVerifying,
  verifyDisabled,
  verifiedLabel,
  notVerifiedLabel,
  verifyLoadingLabel,
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
            <ProfileVerificationStatus
              isVerified={isVerified}
              verifiedLabel={verifiedLabel}
              notVerifiedLabel={notVerifiedLabel}
              verifyLabel={verifyLabel}
              verifyLoadingLabel={verifyLoadingLabel}
              onVerify={onVerify}
              isVerifying={isVerifying}
              verifyDisabled={verifyDisabled}
            />
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
  verifyLoadingLabel,
}: MyProfileCardProps) {
  const hasProfileImage = Boolean(user.profile_picture_url?.trim());

  return (
      <Card className={profileCardClassName}>
        <CardContent className="p-4 sm:p-6">
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
              verifyLoadingLabel={field.verifyLoadingLabel ?? verifyLoadingLabel}
            />
          ))}
        </dl>
        </CardContent>
      </Card>
  );
}

export type { MyProfileCardProps };

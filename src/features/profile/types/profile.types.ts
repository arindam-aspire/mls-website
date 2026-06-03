import type { ChangeEvent, RefObject } from "react";

export type EditEmailFormValues = {
  email: string;
};

export type EditPhoneFormValues = {
  phone_number: string;
};

export type ProfileInfoFieldKind = "name" | "role" | "email" | "phone";

export type ProfileInfoField = {
  label: string;
  value: string;
  kind?: ProfileInfoFieldKind;
  /** Omit when verification badge should not render (e.g. phone not provided). */
  verified?: boolean;
  editLabel?: string;
  onEdit?: () => void;
};

export type MyProfileCardUser = {
  full_name: string;
  profile_picture_url: string | null;
  email: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
};

export type ProfileAvatarUploadBindings = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  onUploadClick: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveClick: () => void;
  isUploading: boolean;
  isRemoving: boolean;
  uploadingLabel: string;
  removingLabel: string;
};

export type MyProfileCardProps = {
  user: MyProfileCardUser;
  sectionTitle: string;
  fields: ProfileInfoField[];
  uploadPhotoLabel: string;
  photoHint: string;
  avatarUpload: ProfileAvatarUploadBindings;
  removeImageLabel: string;
  verifiedLabel: string;
  notVerifiedLabel: string;
};

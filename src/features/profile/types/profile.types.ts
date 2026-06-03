export type EditProfileFormValues = {
  email: string;
  phone_number: string;
};

export type ProfileInfoFieldKind = "default" | "email" | "phone";

export type ProfileInfoField = {
  label: string;
  value: string;
  kind?: ProfileInfoFieldKind;
  /** Omit when verification badge should not render (e.g. phone not provided). */
  verified?: boolean;
};

export type MyProfileCardUser = {
  full_name: string;
  profile_picture_url: string | null;
  email: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
};

export type MyProfileCardProps = {
  user: MyProfileCardUser;
  roleLabel: string;
  sectionTitle: string;
  fields: ProfileInfoField[];
  uploadPhotoLabel: string;
  onUploadProfilePhoto: () => void;
  editLabel: string;
  onEdit: () => void;
  removeImageLabel?: string;
  onRemoveProfilePhoto?: () => void;
  verifiedLabel: string;
  notVerifiedLabel: string;
};

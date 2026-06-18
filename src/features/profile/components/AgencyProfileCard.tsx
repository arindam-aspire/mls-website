"use client";

import {
  Building2,
  CheckCircle,
  Download,
  FileText,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
  User,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Button, Card, CardContent } from "@/src/components/ui";
import { IconButton } from "@/src/components/ui/icon-button";
import { cn } from "@/src/lib/cn";
import { bodyTextClasses, headingSectionClasses } from "@/src/lib/typography";
import type { Agency, AgencyProfileCardProps } from "../types/profile.types";
import { toExternalWebsiteHref } from "../utils/agencyForm.utils";
import { licenseDocumentDisplayName } from "../utils/licenseDocumentDisplay";
import { ProfileAvatarUpload } from "./ProfileAvatarUpload";

const profileCardClassName = "w-full md:max-w-md sm:max-w-none lg:max-w-none md:mx-auto lg:max-w-none lg:mx-0";

const agencyFieldsGridClass = cn(
  "grid min-w-0 grid-cols-1 gap-4 sm:gap-5",
  "lg:grid-cols-2 lg:gap-x-6 lg:gap-y-5",
);

type AgencyDetailFieldProps = {
  label: string;
  value: string;
  icon?: LucideIcon;
  verified?: boolean;
  verifiedLabel?: string;
  notVerifiedLabel?: string;
  editLabel?: string;
  onEdit?: () => void;
  downloadLabel?: string;
  downloadHref?: string | null;
  valueHref?: string | null;
  linkAriaLabel?: string;
  className?: string;
};

function AgencyDetailField({
  label,
  value,
  icon: Icon,
  verified,
  verifiedLabel,
  notVerifiedLabel,
  editLabel,
  onEdit,
  downloadLabel,
  downloadHref,
  valueHref,
  linkAriaLabel,
  className,
}: AgencyDetailFieldProps) {
  const showVerification = verified !== undefined;
  const showEdit = editLabel && onEdit;
  const licenseDownloadUrl = downloadHref?.trim() ?? "";
  const showDownload = Boolean(downloadLabel && licenseDownloadUrl);
  const externalHref = valueHref?.trim() ?? "";
  const showLink = Boolean(externalHref && value.trim().length > 0);
  const isVerified = verified ?? false;

  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:gap-3">
          {Icon ? (
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg sm:size-10",
                "bg-black/5 text-black/70 dark:bg-white/5 dark:text-white/70",
              )}
            >
              <Icon className="size-4 sm:size-5" aria-hidden />
            </div>
          ) : null}
          <div className="min-w-0 flex-1 text-start">
            <dt className="text-xs font-medium text-muted">{label}</dt>
            <dd className="mt-1 text-sm font-medium break-words sm:text-base">
              {showLink ? (
                <a
                  href={externalHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={linkAriaLabel ? `${linkAriaLabel}: ${value}` : undefined}
                  className="text-primary-dark underline-offset-2 transition-colors hover:text-primary hover:underline"
                >
                  {value}
                </a>
              ) : (
                <span className="text-text">{value}</span>
              )}
            </dd>
            {showVerification ? (
              <dd className="mt-2">
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
                  {isVerified ? (verifiedLabel ?? "") : (notVerifiedLabel ?? "")}
                </span>
              </dd>
            ) : null}
          </div>
        </div>
        {(showEdit || showDownload) ? (
          <div className="mt-0.5 flex shrink-0 items-center gap-0.5">
            {showDownload && downloadLabel ? (
              <IconButton
                type="button"
                icon={<Download className="size-4" aria-hidden />}
                aria-label={downloadLabel}
                color="secondary"
                variant="ghost"
                size="sm"
                onClick={() => {
                  window.open(licenseDownloadUrl, "_blank", "noopener,noreferrer");
                }}
                className="rounded-lg"
              />
            ) : null}
            {showEdit ? (
              <IconButton
                type="button"
                icon={<Pencil className="size-4" aria-hidden />}
                aria-label={editLabel}
                color="secondary"
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="rounded-lg"
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function formatAgencyAddress(agency: Agency): string | null {
  const parts = [
    agency.address?.trim(),
    agency.city?.trim(),
    agency.state?.trim(),
    agency.zip_code?.trim(),
    agency.country?.trim(),
  ].filter((part): part is string => Boolean(part));

  return parts.length > 0 ? parts.join(", ") : null;
}

type AgencyHeaderContactItemProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function AgencyHeaderContactItem({ icon: Icon, label, value }: AgencyHeaderContactItemProps) {
  return (
    <span className="inline-flex min-w-0 max-w-full items-center gap-1.5">
      <Icon className="size-4 shrink-0 text-muted" aria-hidden />
      <span className="sr-only">{label}</span>
      <span className="truncate text-muted">{value}</span>
    </span>
  );
}

export function AgencyProfileCard({
  agency,
  user,
  sectionTitle,
  labels,
  uploadLogoLabel,
  avatarUpload,
  removeLogoLabel,
  verifiedLabel,
  notVerifiedLabel,
  editEmailLabel,
  editPhoneLabel,
  editAgencyLabel,
  onEditEmail,
  onEditPhone,
  onEditAgency,
}: AgencyProfileCardProps) {
  const { notProvided } = labels;
  const website = agency.website?.trim() ?? "";
  const websiteHref = toExternalWebsiteHref(website);
  const addressDisplay = formatAgencyAddress(agency);
  const hasLogo = Boolean(agency.logo_url?.trim());
  const agencyName = agency.agency_name.trim() || notProvided;
  const tradeName = agency.agency_trade_name.trim() || notProvided;
  const emailDisplay = user.emailDisplay.trim() || notProvided;
  const phoneDisplay = user.phoneDisplay.trim() || notProvided;
  const licenseUrl = agency.legal_document_s3_link?.trim() ?? "";
  const licenseDisplay =
    licenseDocumentDisplayName(agency.legal_document_s3_link, notProvided) ?? notProvided;

  return (
    <Card className={profileCardClassName}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex min-w-0 flex-col items-center gap-4 lg:flex-row lg:items-start lg:gap-6">
          <ProfileAvatarUpload
            layout="inline"
            src={agency.logo_url}
            name={agency.agency_name}
            uploadLabel={uploadLogoLabel}
            uploadingLabel={avatarUpload.uploadingLabel}
            removeLabel={removeLogoLabel}
            onUploadClick={avatarUpload.onUploadClick}
            onRemoveClick={avatarUpload.onRemoveClick}
            canRemove={hasLogo}
            removingLabel={avatarUpload.removingLabel}
            fileInputRef={avatarUpload.fileInputRef}
            onFileChange={avatarUpload.onFileChange}
            isUploading={avatarUpload.isUploading}
            isRemoving={avatarUpload.isRemoving}
          />
          <div className="flex w-full min-w-0 flex-col items-center gap-3 lg:flex-1 lg:items-start lg:pt-2">
            <div className="hidden w-full min-w-0 lg:block">
              <h2 className={cn("text-start break-words", headingSectionClasses)}>{agencyName}</h2>
              <p className={cn("mt-1 text-start break-words text-muted", bodyTextClasses)}>
                {tradeName}
              </p>
            </div>
            <div
              className={cn(
                "flex w-full min-w-0 flex-col items-center gap-2 lg:items-start",
              )}
            >
              <div
                className={cn(
                  "flex flex-wrap items-center justify-center gap-x-2 gap-y-1",
                  "text-center lg:justify-start lg:text-start",
                  bodyTextClasses,
                )}
              >
                <AgencyHeaderContactItem icon={Mail} label={labels.email} value={emailDisplay} />
                <span className="shrink-0 text-muted" aria-hidden>
                  |
                </span>
                <AgencyHeaderContactItem icon={Phone} label={labels.phone} value={phoneDisplay} />
              </div>
              <Button
                type="button"
                color="inherit"
                variant="ghost"
                size="sm"
                className="h-7 min-h-7 gap-1 px-2 text-xs rounded-lg"
                iconStart={<Pencil className="size-3.5" aria-hidden />}
                onClick={onEditAgency}
              >
                {editAgencyLabel}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 min-w-0 sm:mt-8">
          <h2 className={cn("break-words text-center lg:text-start", headingSectionClasses)}>
            {sectionTitle}
          </h2>

          <dl className={cn(agencyFieldsGridClass, "mt-4 sm:mt-5")}>
            <AgencyDetailField
              icon={Building2}
              label={labels.agencyName}
              value={agency.agency_name.trim() || notProvided}
            />
            <AgencyDetailField
              icon={Building2}
              label={labels.tradeName}
              value={agency.agency_trade_name.trim() || notProvided}
            />
            <AgencyDetailField
              icon={User}
              label={labels.contactName}
              value={user.full_name.trim() || notProvided}
            />
            <AgencyDetailField
              icon={FileText}
              label={labels.license}
              value={licenseDisplay}
              downloadLabel={labels.downloadLicense}
              downloadHref={licenseUrl || null}
            />
            <AgencyDetailField
              icon={Mail}
              label={labels.email}
              value={emailDisplay}
              verified={user.is_email_verified}
              verifiedLabel={verifiedLabel}
              notVerifiedLabel={notVerifiedLabel}
              editLabel={editEmailLabel}
              onEdit={onEditEmail}
            />
            <AgencyDetailField
              icon={Phone}
              label={labels.phone}
              value={phoneDisplay}
              verified={user.hasPhone ? user.is_phone_verified : undefined}
              verifiedLabel={verifiedLabel}
              notVerifiedLabel={notVerifiedLabel}
              editLabel={editPhoneLabel}
              onEdit={onEditPhone}
            />
            <AgencyDetailField
              icon={Globe}
              label={labels.website}
              value={website || notProvided}
              valueHref={websiteHref}
              linkAriaLabel={labels.website}
              className="lg:col-span-2"
            />
            <AgencyDetailField
              icon={MapPin}
              label={labels.address}
              value={addressDisplay ?? notProvided}
              className="lg:col-span-2"
            />
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}

export type { AgencyProfileCardProps };

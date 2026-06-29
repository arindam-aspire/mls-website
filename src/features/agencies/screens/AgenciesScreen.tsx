"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Copy, Mail, Plus, RefreshCcw, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, CopyLinkBar, Input } from "@/src/components/ui";
import {
  createAgencyInvitation,
  createOfflineAgency,
  getAgencyList,
  reviewAgency,
  sendAgencyPasswordLink,
} from "@/src/features/profile/services/profile.service";
import type {
  AgencyInvitationCreateRequest,
  AgencyListItem,
  AgencyOfflineRegistrationRequest,
} from "@/src/features/profile/types/profile.types";
import { useToast } from "@/src/hooks/useToast";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";

const AGENCY_LIST_QUERY_KEY = ["agency", "super-admin-list"] as const;

type OfflineAgencyForm = AgencyOfflineRegistrationRequest;
type InvitationForm = Required<Pick<AgencyInvitationCreateRequest, "email">> &
  Omit<AgencyInvitationCreateRequest, "email">;

const emptyOfflineForm: OfflineAgencyForm = {
  agency_name: "",
  agency_trade_name: "",
  email: "",
  phone: "",
  legal_document_s3_link: "",
  website: "",
  address: "",
  city: "",
  state: "",
  country: "",
  zip_code: "",
  currency: "JOD",
  measurement_unit: "SQM",
};

const emptyInvitationForm: InvitationForm = {
  email: "",
  agency_name: "",
  agency_trade_name: "",
  phone: "",
};

function compactOfflineForm(form: OfflineAgencyForm): AgencyOfflineRegistrationRequest {
  return {
    agency_name: form.agency_name.trim(),
    agency_trade_name: form.agency_trade_name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    legal_document_s3_link: form.legal_document_s3_link?.trim() || null,
    website: form.website?.trim() || null,
    address: form.address?.trim() || null,
    city: form.city?.trim() || null,
    state: form.state?.trim() || null,
    country: form.country?.trim() || null,
    zip_code: form.zip_code?.trim() || null,
    currency: form.currency,
    measurement_unit: form.measurement_unit,
  };
}

function compactInvitationForm(form: InvitationForm): AgencyInvitationCreateRequest {
  return {
    email: form.email.trim(),
    agency_name: form.agency_name?.trim() || null,
    agency_trade_name: form.agency_trade_name?.trim() || null,
    phone: form.phone?.trim() || null,
  };
}

function StatusBadge({ agency }: { agency: AgencyListItem }) {
  const label = agency.status || (agency.is_active ? "ACTIVE" : "PENDING_APPROVAL");
  const isActive = agency.is_active && agency.is_verified;
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : label === "REJECTED"
            ? "bg-rose-50 text-rose-700"
            : "bg-amber-50 text-amber-700",
      )}
    >
      {label.replaceAll("_", " ")}
    </span>
  );
}

export function AgenciesScreen() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [offlineForm, setOfflineForm] = useState<OfflineAgencyForm>(emptyOfflineForm);
  const [invitationForm, setInvitationForm] = useState<InvitationForm>(emptyInvitationForm);
  const [latestLink, setLatestLink] = useState<{ label: string; value: string } | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: AGENCY_LIST_QUERY_KEY,
    queryFn: () => getAgencyList({ skip: 0, limit: 100 }),
  });

  const agencies = data?.items ?? [];
  const activeCount = useMemo(
    () => agencies.filter((agency) => agency.is_active && agency.is_verified).length,
    [agencies],
  );
  const pendingCount = useMemo(
    () => agencies.filter((agency) => agency.status === "PENDING_APPROVAL").length,
    [agencies],
  );

  const invalidateAgencies = () => {
    void queryClient.invalidateQueries({ queryKey: AGENCY_LIST_QUERY_KEY });
    void queryClient.invalidateQueries({ queryKey: ["agency", "list"] });
  };

  const createOfflineMutation = useMutation({
    mutationFn: (body: AgencyOfflineRegistrationRequest) => createOfflineAgency(body),
    onSuccess: (response) => {
      invalidateAgencies();
      setOfflineForm(emptyOfflineForm);
      const link = response.data.password_setup_link;
      if (link) {
        setLatestLink({ label: "Password creation link", value: link });
      }
      toast.success("Agency created", {
        description: response.message ?? "Offline agency registration was created.",
      });
    },
    onError: (error: Error) => {
      toast.error("Could not create agency", { description: error.message });
    },
  });

  const invitationMutation = useMutation({
    mutationFn: (body: AgencyInvitationCreateRequest) => createAgencyInvitation(body),
    onSuccess: (response) => {
      setInvitationForm(emptyInvitationForm);
      if (response.data.invitation_link) {
        setLatestLink({ label: "Invitation link", value: response.data.invitation_link });
      }
      toast.success("Invitation created", {
        description: response.message ?? "Agency invitation was logged in dev mode.",
      });
    },
    onError: (error: Error) => {
      toast.error("Could not create invitation", { description: error.message });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: ({ agencyId, action }: { agencyId: string; action: "approve" | "reject" }) =>
      reviewAgency(agencyId, { action }),
    onSuccess: (response) => {
      invalidateAgencies();
      const link = response.data.password_setup_link;
      if (link) {
        setLatestLink({ label: "Password creation link", value: link });
      }
      toast.success("Agency review updated", {
        description: response.message ?? "Agency status was updated.",
      });
    },
    onError: (error: Error) => {
      toast.error("Could not update agency review", { description: error.message });
    },
  });

  const passwordLinkMutation = useMutation({
    mutationFn: (agencyId: string) => sendAgencyPasswordLink(agencyId),
    onSuccess: (response) => {
      const link = response.data.password_setup_link;
      if (link) {
        setLatestLink({ label: "Password creation link", value: link });
      }
      toast.success("Password link generated", {
        description: response.message ?? "Password creation link was logged in dev mode.",
      });
    },
    onError: (error: Error) => {
      toast.error("Could not generate password link", { description: error.message });
    },
  });

  const copyLatestLink = async () => {
    if (!latestLink) return;
    try {
      await navigator.clipboard.writeText(latestLink.value);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className={headingPageClasses}>Agencies</h1>
          <p className={cn("text-muted", bodyLargeTextClasses)}>
            Create, invite, approve, and activate agencies for platform testing.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex">
          <div className="rounded-lg border border-secondary/15 bg-surface px-4 py-3">
            <p className="text-xs font-medium text-muted">Active</p>
            <p className="text-xl font-bold text-text">{activeCount}</p>
          </div>
          <div className="rounded-lg border border-secondary/15 bg-surface px-4 py-3">
            <p className="text-xs font-medium text-muted">Pending</p>
            <p className="text-xl font-bold text-text">{pendingCount}</p>
          </div>
        </div>
      </div>

      {latestLink ? (
        <section className="rounded-lg border border-primary/20 bg-surface p-4 shadow-sm">
          <CopyLinkBar
            label={latestLink.label}
            value={latestLink.value}
            copyLabel="Copy"
            onCopy={copyLatestLink}
          />
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-2">
        <form
          className="rounded-lg border border-secondary/15 bg-surface p-5 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault();
            createOfflineMutation.mutate(compactOfflineForm(offlineForm));
          }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Plus className="size-5 text-primary" aria-hidden />
            <h2 className="text-lg font-bold text-text">Offline Registration</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Agency name" isRequired value={offlineForm.agency_name} onChange={(event) => setOfflineForm((prev) => ({ ...prev, agency_name: event.target.value }))} />
            <Input label="Trade name" isRequired value={offlineForm.agency_trade_name} onChange={(event) => setOfflineForm((prev) => ({ ...prev, agency_trade_name: event.target.value }))} />
            <Input label="Email" isRequired type="email" value={offlineForm.email} onChange={(event) => setOfflineForm((prev) => ({ ...prev, email: event.target.value }))} />
            <Input label="Phone" isRequired value={offlineForm.phone} onChange={(event) => setOfflineForm((prev) => ({ ...prev, phone: event.target.value }))} />
            <Input label="Legal document URL" value={offlineForm.legal_document_s3_link ?? ""} onChange={(event) => setOfflineForm((prev) => ({ ...prev, legal_document_s3_link: event.target.value }))} />
            <Input label="Website" value={offlineForm.website ?? ""} onChange={(event) => setOfflineForm((prev) => ({ ...prev, website: event.target.value }))} />
            <Input label="City" value={offlineForm.city ?? ""} onChange={(event) => setOfflineForm((prev) => ({ ...prev, city: event.target.value }))} />
            <Input label="Country" value={offlineForm.country ?? ""} onChange={(event) => setOfflineForm((prev) => ({ ...prev, country: event.target.value }))} />
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit" iconStart={<Plus className="size-4" />} isLoading={createOfflineMutation.isPending}>
              Create Agency
            </Button>
          </div>
        </form>

        <form
          className="rounded-lg border border-secondary/15 bg-surface p-5 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault();
            invitationMutation.mutate(compactInvitationForm(invitationForm));
          }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Mail className="size-5 text-primary" aria-hidden />
            <h2 className="text-lg font-bold text-text">Invitation Registration</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Email" isRequired type="email" value={invitationForm.email} onChange={(event) => setInvitationForm((prev) => ({ ...prev, email: event.target.value }))} />
            <Input label="Agency name" value={invitationForm.agency_name ?? ""} onChange={(event) => setInvitationForm((prev) => ({ ...prev, agency_name: event.target.value }))} />
            <Input label="Trade name" value={invitationForm.agency_trade_name ?? ""} onChange={(event) => setInvitationForm((prev) => ({ ...prev, agency_trade_name: event.target.value }))} />
            <Input label="Phone" value={invitationForm.phone ?? ""} onChange={(event) => setInvitationForm((prev) => ({ ...prev, phone: event.target.value }))} />
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit" iconStart={<Mail className="size-4" />} isLoading={invitationMutation.isPending}>
              Send Invitation
            </Button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg border border-secondary/15 bg-surface shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-secondary/10 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-text">Agency Registry</h2>
            <p className="text-sm text-muted">{isFetching ? "Refreshing..." : `${agencies.length} agencies loaded`}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            color="inherit"
            size="sm"
            iconStart={<RefreshCcw className="size-4" />}
            onClick={() => invalidateAgencies()}
          >
            Refresh
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary/10 text-sm">
            <thead className="bg-page">
              <tr className="text-left text-xs font-semibold uppercase text-muted">
                <th className="px-5 py-3">Agency</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {isLoading ? (
                <tr>
                  <td className="px-5 py-8 text-center text-muted" colSpan={4}>Loading agencies...</td>
                </tr>
              ) : agencies.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-center text-muted" colSpan={4}>No agencies found.</td>
                </tr>
              ) : (
                agencies.map((agency) => (
                  <tr key={agency.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-text">{agency.agency_name}</p>
                      <p className="text-xs text-muted">{agency.id}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-text">{agency.email}</p>
                      <p className="text-xs text-muted">{agency.phone || "No phone"}</p>
                    </td>
                    <td className="px-5 py-4"><StatusBadge agency={agency} /></td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {agency.status === "PENDING_APPROVAL" ? (
                          <>
                            <Button type="button" size="sm" color="success" iconStart={<CheckCircle2 className="size-4" />} onClick={() => reviewMutation.mutate({ agencyId: agency.id, action: "approve" })}>
                              Approve
                            </Button>
                            <Button type="button" size="sm" color="danger" variant="outline" iconStart={<XCircle className="size-4" />} onClick={() => reviewMutation.mutate({ agencyId: agency.id, action: "reject" })}>
                              Reject
                            </Button>
                          </>
                        ) : null}
                        {agency.status === "APPROVED" || agency.status === "ACTIVE" ? (
                          <Button type="button" size="sm" variant="outline" color="inherit" iconStart={<Copy className="size-4" />} onClick={() => passwordLinkMutation.mutate(agency.id)}>
                            Password Link
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

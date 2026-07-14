"use client";

import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import {
  Button,
  Card,
  CardContent,
  Input,
  Select,
  Textarea,
} from "@/src/components/ui";
import {
  Modal,
  ModalBackdrop,
  ModalCloseButton,
  ModalContainer,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalPanel,
  ModalTitle,
} from "@/src/components/ui/modal";
import { AssignAgentModal } from "@/src/features/property/components/AssignAgentModal";
import { ContactModal } from "@/src/features/contact/components/ContactModal";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";
import { LeadDetailsScreenSkeleton } from "../components/LeadScreenSkeletons";
import { LeadStatusBadge } from "../components/LeadStatusBadge";
import { useLeadDetailsScreen } from "../hooks/useLeadDetailsScreen";
import type { LeadDetailTab } from "../types/lead.types";

type LeadDetailsScreenProps = {
  leadId: string;
  initialTab?: string | null;
};

function InfoCard({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <Card className="rounded-xl border border-secondary/15 bg-surface">
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-text sm:text-base">{title}</h3>
        <dl className="mt-4 space-y-3">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4"
            >
              <dt className="text-sm text-muted">{row.label}</dt>
              <dd className="text-sm font-medium text-text sm:text-end">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

export function LeadDetailsScreen({
  leadId,
  initialTab,
}: LeadDetailsScreenProps) {
  const screen = useLeadDetailsScreen({ leadId, initialTab });
  const { labels, permissions, display } = screen;

  if (screen.isLoading && !screen.lead) {
    return <LeadDetailsScreenSkeleton />;
  }

  if (!screen.lead || !display) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 text-center sm:px-6">
        <p className="text-base font-semibold text-text">{labels.notFound}</p>
        <Button
          type="button"
          variant="outline"
          color="secondary"
          className="mt-4 min-h-11"
          onClick={screen.onBack}
        >
          {labels.backToList}
        </Button>
      </div>
    );
  }

  const tabs: { id: LeadDetailTab; label: string }[] = [
    { id: "overview", label: labels.tabs.overview },
    { id: "conversation", label: labels.tabs.conversation },
    { id: "notes", label: labels.tabs.notes },
    { id: "timeline", label: labels.tabs.timeline },
    { id: "close", label: labels.tabs.close },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <Button
        type="button"
        variant="ghost"
        color="secondary"
        className="min-h-11 px-0"
        onClick={screen.onBack}
      >
        {labels.backToList}
      </Button>

      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className={cn(headingPageClasses)}>{display.leadNumber}</h1>
          <p className={cn(bodyLargeTextClasses, "text-muted")}>
            {labels.detailsPageTitle}
          </p>
        </div>
        <LeadStatusBadge status={display.status} label={display.statusLabel} />
      </header>

      <div className="flex flex-wrap gap-2">
        {permissions.canReply ? (
          <Button type="button" className="min-h-11" onClick={screen.reply.onOpen}>
            {labels.actions.reply}
          </Button>
        ) : null}
        {permissions.canAddNote ? (
          <Button
            type="button"
            variant="outline"
            color="secondary"
            className="min-h-11"
            onClick={screen.note.onOpen}
          >
            {labels.actions.addNote}
          </Button>
        ) : null}
        {permissions.canUpdateStatus ? (
          <Button
            type="button"
            variant="outline"
            color="secondary"
            className="min-h-11"
            onClick={screen.statusModal.onOpenUpdate}
          >
            {labels.actions.updateStatus}
          </Button>
        ) : null}
        {permissions.canRequestClose ? (
          <Button
            type="button"
            variant="outline"
            color="secondary"
            className="min-h-11"
            onClick={screen.requestClose.onOpen}
          >
            {labels.actions.requestClose}
          </Button>
        ) : null}
        {permissions.canAssign ? (
          <Button
            type="button"
            variant="outline"
            color="secondary"
            className="min-h-11"
            onClick={screen.assign.onOpen}
          >
            {permissions.assignMode === "reassign"
              ? labels.actions.reassign
              : labels.actions.assign}
          </Button>
        ) : null}
        {permissions.canOverrideStatus ? (
          <Button
            type="button"
            variant="outline"
            color="secondary"
            className="min-h-11"
            onClick={screen.statusModal.onOpenOverride}
          >
            {labels.actions.overrideStatus}
          </Button>
        ) : null}
        {permissions.canApproveOrRejectClose ? (
          <>
            <Button
              type="button"
              color="success"
              className="min-h-11"
              onClick={screen.approveClose.onOpen}
            >
              {labels.actions.approveClose}
            </Button>
            <Button
              type="button"
              color="danger"
              variant="outline"
              className="min-h-11"
              onClick={screen.rejectClose.onOpen}
            >
              {labels.actions.rejectClose}
            </Button>
          </>
        ) : null}
        <Button
          type="button"
          variant="outline"
          color="secondary"
          className="min-h-11"
          onClick={screen.customerContact.onEmail}
        >
          {labels.actions.emailCustomer}
        </Button>
        <Button
          type="button"
          variant="outline"
          color="secondary"
          className="min-h-11"
          onClick={screen.customerContact.onWhatsApp}
        >
          {labels.actions.whatsappCustomer}
        </Button>
        <Button
          type="button"
          variant="outline"
          color="secondary"
          className="min-h-11"
          onClick={screen.customerContact.onCall}
        >
          {labels.actions.callCustomer}
        </Button>
      </div>

      <div
        role="tablist"
        aria-label={labels.detailsPageTitle}
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={screen.tab === tab.id}
            variant={screen.tab === tab.id ? "solid" : "outline"}
            color={screen.tab === tab.id ? "primary" : "secondary"}
            className="min-h-11 shrink-0"
            onClick={() => screen.onTabChange(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {screen.tab === "overview" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <InfoCard
            title={labels.customerInfo}
            rows={[
              { label: labels.name, value: display.customerName },
              { label: labels.email, value: display.customerEmail },
              { label: labels.phone, value: display.customerPhone },
              {
                label: labels.communicationMode,
                value: display.communicationMode,
              },
            ]}
          />
          <InfoCard
            title={labels.propertyInfo}
            rows={[
              { label: labels.propertyTitle, value: display.propertyTitle },
              { label: labels.propertyId, value: display.propertyId },
              { label: labels.propertyHash, value: display.propertyHash },
            ]}
          />
          <InfoCard
            title={labels.inquiry}
            rows={[
              { label: labels.inquiryType, value: display.inquiryType },
              { label: labels.source, value: display.sourceLabel },
              { label: labels.message, value: display.message },
            ]}
          />
          <InfoCard
            title={labels.status}
            rows={[
              { label: labels.leadNumber, value: display.leadNumber },
              { label: labels.status, value: display.statusLabel },
              { label: labels.assignedAgent, value: display.assignedAgent },
              { label: labels.createdAt, value: display.createdAt },
              { label: labels.lastActivity, value: display.lastActivity },
            ]}
          />
        </div>
      ) : null}

      {screen.tab === "conversation" ? (
        <Card className="rounded-xl border border-secondary/15 bg-surface">
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-base font-semibold text-text">
                {labels.conversation.title}
              </h3>
              {permissions.canReply ? (
                <Button type="button" className="min-h-11" onClick={screen.reply.onOpen}>
                  {labels.actions.reply}
                </Button>
              ) : null}
            </div>
            {screen.conversation.hasList ? (
              <ul className="space-y-3">
                {screen.conversation.items.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-secondary/15 bg-page p-3 sm:p-4"
                  >
                    <p className="text-sm text-text">{item.message}</p>
                    <p className="mt-2 text-xs text-muted">
                      {labels.conversation.channel}: {item.channel} ·{" "}
                      {screen.formatDate(item.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-dashed border-secondary/20 bg-page px-4 py-8 text-center">
                <p className="text-sm font-semibold text-text">
                  {labels.conversation.emptyTitle}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {labels.conversation.emptyDescription}
                </p>
                <p className="mt-3 text-xs text-muted">
                  {labels.conversation.listUnavailable}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      {screen.tab === "notes" ? (
        <Card className="rounded-xl border border-secondary/15 bg-surface">
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-base font-semibold text-text">
                {labels.notes.title}
              </h3>
              {permissions.canAddNote ? (
                <Button type="button" className="min-h-11" onClick={screen.note.onOpen}>
                  {labels.actions.addNote}
                </Button>
              ) : null}
            </div>
            {screen.notes.hasList ? (
              <ul className="space-y-3">
                {screen.notes.items.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-secondary/15 bg-page p-3 sm:p-4"
                  >
                    <p className="text-sm text-text">{item.note}</p>
                    <p className="mt-2 text-xs text-muted">
                      {screen.formatDate(item.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-dashed border-secondary/20 bg-page px-4 py-8 text-center">
                <p className="text-sm font-semibold text-text">
                  {labels.notes.emptyTitle}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {labels.notes.emptyDescription}
                </p>
                <p className="mt-3 text-xs text-muted">
                  {labels.notes.listUnavailable}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      {screen.tab === "timeline" ? (
        <Card className="rounded-xl border border-secondary/15 bg-surface">
          <CardContent className="space-y-4 p-4 sm:p-6">
            <h3 className="text-base font-semibold text-text">
              {labels.timeline.title}
            </h3>
            {screen.timeline.items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-secondary/20 bg-page px-4 py-8 text-center">
                <p className="text-sm font-semibold text-text">
                  {labels.timeline.emptyTitle}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {labels.timeline.emptyDescription}
                </p>
              </div>
            ) : (
              <ol className="relative space-y-4 border-s border-secondary/20 ms-3 ps-6">
                {screen.timeline.items.map((item) => (
                  <li key={item.id} className="relative">
                    <span className="absolute -start-[1.625rem] top-1 size-3 rounded-full bg-primary" />
                    <p className="text-sm font-semibold text-text">{item.title}</p>
                    {item.description ? (
                      <p className="mt-1 text-sm text-muted">{item.description}</p>
                    ) : null}
                    <p className="mt-1 text-xs text-muted">
                      {screen.formatDate(item.created_at)}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      ) : null}

      {screen.tab === "close" ? (
        <Card className="rounded-xl border border-secondary/15 bg-surface">
          <CardContent className="space-y-4 p-4 sm:p-6">
            <h3 className="text-base font-semibold text-text">
              {labels.close.title}
            </h3>
            <p className="text-sm text-muted">
              {permissions.canApproveOrRejectClose
                ? labels.close.pendingDescription
                : labels.close.notPendingDescription}
            </p>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">{labels.close.requestCloseAt}</dt>
                <dd className="text-text">{display.requestCloseAt}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">{labels.close.closedAt}</dt>
                <dd className="text-text">{display.closedAt}</dd>
              </div>
            </dl>
            {permissions.canApproveOrRejectClose ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  color="success"
                  className="min-h-11"
                  onClick={screen.approveClose.onOpen}
                >
                  {labels.actions.approveClose}
                </Button>
                <Button
                  type="button"
                  color="danger"
                  variant="outline"
                  className="min-h-11"
                  onClick={screen.rejectClose.onOpen}
                >
                  {labels.actions.rejectClose}
                </Button>
              </div>
            ) : null}
            {permissions.canRequestClose ? (
              <Button
                type="button"
                variant="outline"
                color="secondary"
                className="min-h-11"
                onClick={screen.requestClose.onOpen}
              >
                {labels.actions.requestClose}
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Modal open={screen.reply.open} onClose={screen.reply.onClose} size="md">
        <ModalBackdrop />
        <ModalContainer>
          <ModalPanel size="md">
            <ModalHeader>
              <ModalTitle>{labels.modals.reply.title}</ModalTitle>
              <ModalCloseButton />
            </ModalHeader>
            <ModalDescription>{labels.modals.reply.description}</ModalDescription>
            <ModalContent className="space-y-4">
              <Select
                label={labels.modals.reply.channelLabel}
                value={screen.reply.channel}
                onChange={(value) =>
                  screen.reply.onChannelChange(
                    value as "IN_APP" | "EMAIL" | "SMS",
                  )
                }
                options={[
                  { value: "IN_APP", label: labels.modals.reply.channelInApp },
                  { value: "EMAIL", label: labels.modals.reply.channelEmail },
                  { value: "SMS", label: labels.modals.reply.channelSms },
                ]}
                fullWidth
              />
              <Textarea
                label={labels.modals.reply.messageLabel}
                placeholder={labels.modals.reply.messagePlaceholder}
                value={screen.reply.message}
                onChange={(event) =>
                  screen.reply.onMessageChange(event.target.value)
                }
                error={screen.reply.error ?? undefined}
                rows={4}
              />
            </ModalContent>
            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                color="secondary"
                className="min-h-11"
                onClick={screen.reply.onClose}
              >
                {labels.modals.reply.cancel}
              </Button>
              <Button
                type="button"
                className="min-h-11"
                isLoading={screen.reply.isSubmitting}
                onClick={screen.reply.onSubmit}
              >
                {labels.modals.reply.submit}
              </Button>
            </ModalFooter>
          </ModalPanel>
        </ModalContainer>
      </Modal>

      <Modal open={screen.note.open} onClose={screen.note.onClose} size="md">
        <ModalBackdrop />
        <ModalContainer>
          <ModalPanel size="md">
            <ModalHeader>
              <ModalTitle>{labels.modals.note.title}</ModalTitle>
              <ModalCloseButton />
            </ModalHeader>
            <ModalDescription>{labels.modals.note.description}</ModalDescription>
            <ModalContent>
              <Textarea
                label={labels.modals.note.noteLabel}
                placeholder={labels.modals.note.notePlaceholder}
                value={screen.note.text}
                onChange={(event) => screen.note.onTextChange(event.target.value)}
                error={screen.note.error ?? undefined}
                rows={4}
              />
            </ModalContent>
            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                color="secondary"
                className="min-h-11"
                onClick={screen.note.onClose}
              >
                {labels.modals.note.cancel}
              </Button>
              <Button
                type="button"
                className="min-h-11"
                isLoading={screen.note.isSubmitting}
                onClick={screen.note.onSubmit}
              >
                {labels.modals.note.submit}
              </Button>
            </ModalFooter>
          </ModalPanel>
        </ModalContainer>
      </Modal>

      <Modal open={screen.statusModal.open} onClose={screen.statusModal.onClose} size="md">
        <ModalBackdrop />
        <ModalContainer>
          <ModalPanel size="md">
            <ModalHeader>
              <ModalTitle>{labels.modals.status.title}</ModalTitle>
              <ModalCloseButton />
            </ModalHeader>
            <ModalDescription>
              {labels.modals.status.description}
            </ModalDescription>
            <ModalContent className="space-y-4">
              <Select
                label={labels.modals.status.statusLabel}
                value={screen.statusModal.value}
                options={screen.statusModal.options}
                onChange={(value) =>
                  screen.statusModal.onValueChange(value as typeof screen.statusModal.value)
                }
                fullWidth
              />
              <Input
                label={labels.modals.status.reasonLabel}
                placeholder={labels.modals.status.reasonPlaceholder}
                value={screen.statusModal.reason}
                onChange={(event) =>
                  screen.statusModal.onReasonChange(event.target.value)
                }
              />
            </ModalContent>
            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                color="secondary"
                className="min-h-11"
                onClick={screen.statusModal.onClose}
              >
                {labels.modals.status.cancel}
              </Button>
              <Button
                type="button"
                className="min-h-11"
                isLoading={screen.statusModal.isSubmitting}
                onClick={screen.statusModal.onSubmit}
              >
                {labels.modals.status.submit}
              </Button>
            </ModalFooter>
          </ModalPanel>
        </ModalContainer>
      </Modal>

      <ConfirmModal
        open={screen.requestClose.open}
        onClose={screen.requestClose.onClose}
        onConfirm={screen.requestClose.onConfirm}
        variant="warning"
        title={labels.modals.requestClose.title}
        description={labels.modals.requestClose.description}
        confirmLabel={labels.modals.requestClose.confirm}
        cancelLabel={labels.modals.requestClose.cancel}
        isLoading={screen.requestClose.isSubmitting}
      />

      <ConfirmModal
        open={screen.approveClose.open}
        onClose={screen.approveClose.onClose}
        onConfirm={screen.approveClose.onConfirm}
        variant="success"
        title={labels.modals.approveClose.title}
        description={labels.modals.approveClose.description}
        confirmLabel={labels.modals.approveClose.confirm}
        cancelLabel={labels.modals.approveClose.cancel}
        isLoading={screen.approveClose.isSubmitting}
      >
        <Input
          label={labels.modals.approveClose.reasonLabel}
          placeholder={labels.modals.approveClose.reasonPlaceholder}
          value={screen.approveClose.reason}
          onChange={(event) =>
            screen.approveClose.onReasonChange(event.target.value)
          }
        />
      </ConfirmModal>

      <ConfirmModal
        open={screen.rejectClose.open}
        onClose={screen.rejectClose.onClose}
        onConfirm={screen.rejectClose.onConfirm}
        variant="danger"
        title={labels.modals.rejectClose.title}
        description={labels.modals.rejectClose.description}
        confirmLabel={labels.modals.rejectClose.confirm}
        cancelLabel={labels.modals.rejectClose.cancel}
        isLoading={screen.rejectClose.isSubmitting}
      >
        <Input
          label={labels.modals.rejectClose.reasonLabel}
          placeholder={labels.modals.rejectClose.reasonPlaceholder}
          value={screen.rejectClose.reason}
          onChange={(event) =>
            screen.rejectClose.onReasonChange(event.target.value)
          }
        />
      </ConfirmModal>

      <AssignAgentModal
        open={screen.assign.open}
        listingTitle={display.leadNumber}
        mode={permissions.assignMode}
        isAssigning={screen.assign.isAssigning}
        onClose={screen.assign.onClose}
        onAssign={screen.assign.onAssign}
      />

      <ContactModal contactModal={screen.contactModal} />
    </div>
  );
}

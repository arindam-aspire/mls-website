"use client";

import { Avatar, Button, SearchInput } from "@/src/components/ui";
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
import { UserCog, UserPlus } from "lucide-react";
import { useAssignAgentModal } from "../hooks/useAssignAgentModal";
import type { AssignAgentModalMode } from "../types/assignAgentModal.types";
import { AssignAgentListItem } from "./AssignAgentListItem";
import { AssignAgentModalSkeleton } from "./AssignAgentModalSkeleton";

type AssignAgentModalProps = {
  open: boolean;
  listingTitle: string;
  mode?: AssignAgentModalMode;
  isAssigning?: boolean;
  onClose: () => void;
  onAssign: (agentId: string) => void;
};

function AssignAgentEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-secondary/20 bg-page px-4 py-10 text-center sm:px-6">
      <p className="text-sm font-semibold text-text sm:text-base">{title}</p>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
}

export function AssignAgentModal({
  open,
  listingTitle,
  mode = "assign",
  isAssigning = false,
  onClose,
  onAssign,
}: AssignAgentModalProps) {
  const {
    title,
    description,
    agents,
    selectedAgentId,
    selectedAgent,
    searchQuery,
    isLoading,
    isLoadingMore,
    isEmpty,
    isSearchEmpty,
    isError,
    hasMore,
    closeModal,
    onSelectAgent,
    onSearchChange,
    onClearSearch,
    onLoadMore,
    onContinue,
    continueLabel,
    continueLoadingLabel,
    loadMoreLabel,
    emptyTitle,
    emptyDescription,
    noSearchResultsTitle,
    noSearchResultsDescription,
    agentListAriaLabel,
    searchPlaceholder,
    clearSearchLabel,
    agentCountLabel,
    selectHint,
    buildAgentAriaLabel,
  } = useAssignAgentModal({
    open,
    listingTitle,
    mode,
    isAssigning,
    onClose,
    onAssign,
  });

  const SubmitIcon = mode === "reassign" ? UserCog : UserPlus;

  const selectedDisplayName =
    selectedAgent?.fullName.trim() || selectedAgent?.email.trim() || "";
  const selectedSubtitle =
    selectedAgent?.email.trim() || selectedAgent?.phone.trim() || "";

  return (
    <Modal open={open} onClose={closeModal} size="lg">
      <ModalBackdrop />
      <ModalContainer>
        <ModalPanel size="lg">
          <ModalHeader>
            <div className="min-w-0 space-y-1">
              <ModalTitle>{title}</ModalTitle>
              <ModalDescription>{description}</ModalDescription>
            </div>
            <ModalCloseButton />
          </ModalHeader>

          <ModalContent className="space-y-3 px-4 sm:space-y-4 sm:px-6">
            {isLoading ? (
              <AssignAgentModalSkeleton />
            ) : isEmpty || isError ? (
              <AssignAgentEmptyState
                title={emptyTitle}
                description={emptyDescription}
              />
            ) : (
              <>
                <SearchInput
                  size="md"
                  variant="outline"
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder}
                  clearLabel={clearSearchLabel}
                  disabled={isAssigning}
                  value={searchQuery}
                  onChange={(event) => {
                    onSearchChange(event.target.value);
                  }}
                  onClear={onClearSearch}
                  wrapperClassName="rounded-lg"
                />

                <p className="text-xs font-medium text-muted sm:text-sm">
                  {agentCountLabel}
                </p>

                {isSearchEmpty ? (
                  <AssignAgentEmptyState
                    title={noSearchResultsTitle}
                    description={noSearchResultsDescription}
                  />
                ) : (
                  <div
                    role="radiogroup"
                    aria-label={agentListAriaLabel}
                    className="max-h-[min(26rem,52vh)] space-y-2.5 overflow-y-auto pe-0.5 sm:space-y-3"
                  >
                    {agents.map((agent) => (
                      <AssignAgentListItem
                        key={agent.id}
                        agent={agent}
                        selected={selectedAgentId === agent.id}
                        disabled={isAssigning}
                        onSelect={() => onSelectAgent(agent)}
                        ariaLabel={buildAgentAriaLabel(agent)}
                      />
                    ))}

                    {hasMore ? (
                      <div className="pt-1">
                        <Button
                          type="button"
                          color="inherit"
                          variant="outline"
                          size="md"
                          className="w-full rounded-lg"
                          isLoading={isLoadingMore}
                          loadingLabel={loadMoreLabel}
                          onClick={onLoadMore}
                        >
                          {loadMoreLabel}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                )}
              </>
            )}
          </ModalContent>

          {!isLoading && !isEmpty && !isError ? (
            <ModalFooter className="flex flex-col gap-3 border-t border-secondary/10 px-4 pt-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex min-h-11 min-w-0 items-center gap-2.5 sm:flex-1">
                {selectedAgent ? (
                  <>
                    <Avatar
                      alt=""
                      name={selectedDisplayName}
                      size="sm"
                      className="ring-2 ring-primary/30"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-text">
                        {selectedDisplayName}
                      </p>
                      {selectedSubtitle ? (
                        <p className="truncate text-xs text-muted">{selectedSubtitle}</p>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted">{selectHint}</p>
                )}
              </div>

              <Button
                type="button"
                color="primary"
                variant="solid"
                size="md"
                className="w-full shrink-0 rounded-lg sm:w-auto"
                iconStart={<SubmitIcon className="size-4" aria-hidden />}
                isLoading={isAssigning}
                loadingLabel={continueLoadingLabel}
                onClick={onContinue}
              >
                {continueLabel}
              </Button>
            </ModalFooter>
          ) : null}
        </ModalPanel>
      </ModalContainer>
    </Modal>
  );
}

export type { AssignAgentModalProps };

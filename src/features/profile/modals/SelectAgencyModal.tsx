"use client";

import type { Dispatch, SetStateAction } from "react";
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
import { selectAgencyAvatarSelectedClassName } from "../constants/selectAgency.constants";
import { SelectAgencyListItem } from "../components/SelectAgencyListItem";
import { SelectAgencyModalSkeleton } from "../components/SelectAgencyModalSkeleton";
import { useSelectAgencyModal } from "../hooks/useSelectAgencyModal";

type SelectAgencyModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

function SelectAgencyEmptyState({
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

export function SelectAgencyModal({ isOpen, setIsOpen }: SelectAgencyModalProps) {
  const {
    title,
    description,
    agencies,
    selectedAgencyId,
    selectedAgency,
    searchQuery,
    isLoading,
    isContinuePending,
    isEmpty,
    isSearchEmpty,
    isError,
    closeModal,
    onSelectAgency,
    onSearchChange,
    onClearSearch,
    onContinue,
    continueLabel,
    continueLoadingLabel,
    emptyTitle,
    emptyDescription,
    noSearchResultsTitle,
    noSearchResultsDescription,
    agencyListAriaLabel,
    searchPlaceholder,
    clearSearchLabel,
    agencyCountLabel,
    selectHint,
    buildAgencyAriaLabel,
  } = useSelectAgencyModal({ isOpen, setIsOpen });

  const selectedDisplayName =
    selectedAgency?.agency_name.trim() || selectedAgency?.email.trim() || "";
  const selectedSubtitle =
    selectedAgency?.email.trim() || selectedAgency?.phone.trim() || "";

  return (
    <Modal open={isOpen} onClose={closeModal} size="lg">
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
              <SelectAgencyModalSkeleton />
            ) : isEmpty || isError ? (
              <SelectAgencyEmptyState
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
                  disabled={isContinuePending}
                  value={searchQuery}
                  onChange={(event) => {
                    onSearchChange(event.target.value);
                  }}
                  onClear={onClearSearch}
                  wrapperClassName="rounded-lg"
                />

                <p className="text-xs font-medium text-muted sm:text-sm">
                  {agencyCountLabel}
                </p>

                {isSearchEmpty ? (
                  <SelectAgencyEmptyState
                    title={noSearchResultsTitle}
                    description={noSearchResultsDescription}
                  />
                ) : (
                  <div
                    role="radiogroup"
                    aria-label={agencyListAriaLabel}
                    className="max-h-[min(26rem,52vh)] space-y-2.5 overflow-y-auto pe-0.5 sm:space-y-3"
                  >
                    {agencies.map((agency) => (
                      <SelectAgencyListItem
                        key={agency.id}
                        agency={agency}
                        selected={selectedAgencyId === agency.id}
                        disabled={isContinuePending}
                        onSelect={() => onSelectAgency(agency)}
                        ariaLabel={buildAgencyAriaLabel(agency)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </ModalContent>

          {!isLoading && !isEmpty && !isError ? (
            <ModalFooter className="flex flex-col gap-3 border-t border-secondary/10 px-4 pt-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex min-h-11 min-w-0 items-center gap-2.5 sm:flex-1">
                {selectedAgency ? (
                  <>
                    <Avatar
                      src={selectedAgency.logo_url}
                      alt=""
                      name={selectedDisplayName}
                      size="sm"
                      className={selectAgencyAvatarSelectedClassName}
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
                isLoading={isContinuePending}
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

export type { SelectAgencyModalProps };

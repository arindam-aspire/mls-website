"use client";

import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { Button, Select } from "@/src/components/ui";
import { OwnerList } from "@/src/features/user/components/OwnerList";
import { useOwnersScreen } from "@/src/features/user/hooks/useOwnersScreen";
import { OwnerEditModal } from "@/src/features/user/modals/OwnerEditModal";
import { OwnerLinkedResourcesModal } from "@/src/features/user/modals/OwnerLinkedResourcesModal";
import { OwnerViewModal } from "@/src/features/user/modals/OwnerViewModal";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";

export function OwnersScreen() {
  const {
    pageTitle,
    pageSubtitle,
    isSuperAdmin,
    assignment,
    listFilters,
    ownerList,
    ownerStatusConfirmModal,
    ownerViewModal,
    ownerEditModal,
    ownerLinkedResourcesModal,
  } = useOwnersScreen();

  return (
    <>
      <div className="flex w-full min-w-0 flex-col gap-2 md:gap-4 lg:gap-6">
        <div className="min-w-0 flex-1">
          <h1 className={headingPageClasses}>{pageTitle}</h1>
          <p className={cn("text-muted", bodyLargeTextClasses)}>{pageSubtitle}</p>
        </div>

        {isSuperAdmin ? (
          <section className="rounded-xl border border-secondary/15 bg-surface p-4 shadow-sm sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
              <div>
                <h2 className="text-lg font-bold text-text">{assignment.title}</h2>
                <p className="mt-1 text-sm text-muted">{assignment.description}</p>
              </div>
              <Select
                label={assignment.agencyLabel}
                placeholder={assignment.agencyPlaceholder}
                value={assignment.assignmentAgencyId}
                options={assignment.agencyOptions}
                onChange={assignment.onAssignmentAgencyChange}
                disabled={
                  assignment.isAgencyListFetching ||
                  assignment.agencyOptions.length === 0
                }
              />
            </div>

            {assignment.assignmentAgencyId ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-secondary/15">
                <div className="border-b border-secondary/10 px-4 py-3 sm:px-5">
                  <p className="text-sm text-muted">
                    {ownerList.isFetching
                      ? assignment.refreshingLabel
                      : assignment.ownersOnPageLabel}
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-secondary/10 text-sm">
                    <thead className="bg-page">
                      <tr className="text-left text-xs font-semibold uppercase text-muted">
                        <th className="px-4 py-3 sm:px-5">
                          {assignment.ownerColumnLabel}
                        </th>
                        <th className="px-4 py-3 sm:px-5">
                          {assignment.agenciesColumnLabel}
                        </th>
                        <th className="px-4 py-3 text-right sm:px-5">
                          {assignment.actionColumnLabel}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/10">
                      {ownerList.isLoading ? (
                        <tr>
                          <td
                            className="px-4 py-8 text-center text-muted sm:px-5"
                            colSpan={3}
                          >
                            {assignment.loadingLabel}
                          </td>
                        </tr>
                      ) : assignment.platformOwners.length === 0 ? (
                        <tr>
                          <td
                            className="px-4 py-8 text-center text-muted sm:px-5"
                            colSpan={3}
                          >
                            {assignment.emptyLabel}
                          </td>
                        </tr>
                      ) : (
                        assignment.platformOwners.map((owner) => (
                          <tr key={owner.owner_id}>
                            <td className="px-4 py-4 sm:px-5">
                              <p className="font-semibold text-text">{owner.full_name}</p>
                              <p className="text-xs text-muted">{owner.email}</p>
                              <p className="text-xs text-muted">
                                {owner.phone || assignment.noPhoneLabel}
                              </p>
                            </td>
                            <td className="px-4 py-4 sm:px-5">
                              {owner.assigned_agencies?.length ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {owner.assigned_agencies.map((agency) => (
                                    <span
                                      key={agency.id}
                                      className="rounded-lg bg-primary-light px-2.5 py-1 text-xs font-medium text-primary-dark"
                                    >
                                      {agency.agency_name || agency.id}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted">
                                  {assignment.unassignedLabel}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4 text-right sm:px-5">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                color="inherit"
                                className="rounded-lg"
                                disabled={!assignment.assignmentAgencyId}
                                isLoading={
                                  assignment.isAssigningOwner &&
                                  assignment.assigningOwnerId === owner.owner_id
                                }
                                onClick={() =>
                                  assignment.assignOwnerToSelectedAgency(owner.owner_id)
                                }
                              >
                                {assignment.assignLabel}
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {ownerList.pagination ? (
                  <div className="flex flex-col gap-3 border-t border-secondary/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <p className="text-sm text-muted">{assignment.pageLabel}</p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        color="inherit"
                        className="rounded-lg"
                        disabled={!ownerList.pagination.hasPrevious}
                        onClick={() =>
                          ownerList.onPageChange(ownerList.pagination!.page - 1)
                        }
                      >
                        {assignment.previousLabel}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        color="inherit"
                        className="rounded-lg"
                        disabled={!ownerList.pagination.hasNext}
                        onClick={() =>
                          ownerList.onPageChange(ownerList.pagination!.page + 1)
                        }
                      >
                        {assignment.nextLabel}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>
        ) : null}

        <OwnerList filters={listFilters} list={ownerList} />
      </div>

      {ownerStatusConfirmModal ? (
        <ConfirmModal {...ownerStatusConfirmModal} />
      ) : null}

      <OwnerViewModal {...ownerViewModal} />

      {ownerEditModal ? <OwnerEditModal {...ownerEditModal} /> : null}

      <OwnerLinkedResourcesModal {...ownerLinkedResourcesModal} />
    </>
  );
}

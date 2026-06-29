"use client";

import { Button, Select } from "@/src/components/ui";
import { OwnerList } from "@/src/features/user/components/OwnerList";
import { useOwnersScreen } from "@/src/features/user/hooks/useOwnersScreen";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";

export function OwnersScreen() {
  const {
    pageTitle,
    pageSubtitle,
    isSuperAdmin,
    assignmentAgencyId,
    onAssignmentAgencyChange,
    agencyOptions,
    isAgencyListFetching,
    platformOwners,
    assignOwnerToSelectedAgency,
    assigningOwnerId,
    isAssigningOwner,
    listFilters,
    ownerList,
  } = useOwnersScreen();

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 md:gap-4 lg:gap-6">
      <div className="min-w-0 flex-1">
        <h1 className={headingPageClasses}>{pageTitle}</h1>
        <p className={cn("text-muted", bodyLargeTextClasses)}>{pageSubtitle}</p>
      </div>

      {isSuperAdmin ? (
        <>
          <section className="rounded-lg border border-secondary/15 bg-surface p-5 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
              <div>
                <h2 className="text-lg font-bold text-text">Owner Agency Assignment</h2>
                <p className="mt-1 text-sm text-muted">
                  Select an active verified agency, then assign owners from the platform list.
                </p>
              </div>
              <Select
                label="Target agency"
                placeholder={isAgencyListFetching ? "Loading agencies..." : "Select agency"}
                value={assignmentAgencyId}
                options={agencyOptions}
                onChange={onAssignmentAgencyChange}
                disabled={isAgencyListFetching || agencyOptions.length === 0}
              />
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-secondary/15 bg-surface shadow-sm">
            <div className="border-b border-secondary/10 px-5 py-4">
              <h2 className="text-lg font-bold text-text">Platform Owners</h2>
              <p className="text-sm text-muted">
                {ownerList.isFetching ? "Refreshing..." : `${platformOwners.length} owners on this page`}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-secondary/10 text-sm">
                <thead className="bg-page">
                  <tr className="text-left text-xs font-semibold uppercase text-muted">
                    <th className="px-5 py-3">Owner</th>
                    <th className="px-5 py-3">Contact</th>
                    <th className="px-5 py-3">Assigned Agencies</th>
                    <th className="px-5 py-3">Properties</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/10">
                  {ownerList.isLoading ? (
                    <tr>
                      <td className="px-5 py-8 text-center text-muted" colSpan={5}>
                        Loading owners...
                      </td>
                    </tr>
                  ) : platformOwners.length === 0 ? (
                    <tr>
                      <td className="px-5 py-8 text-center text-muted" colSpan={5}>
                        No owners found.
                      </td>
                    </tr>
                  ) : (
                    platformOwners.map((owner) => (
                      <tr key={owner.owner_id}>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-text">{owner.full_name}</p>
                          <p className="text-xs text-muted">{owner.owner_id}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-text">{owner.email}</p>
                          <p className="text-xs text-muted">{owner.phone || "No phone"}</p>
                        </td>
                        <td className="px-5 py-4">
                          {owner.assigned_agencies?.length ? (
                            <div className="flex flex-wrap gap-1.5">
                              {owner.assigned_agencies.map((agency) => (
                                <span
                                  key={agency.id}
                                  className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary-dark"
                                >
                                  {agency.agency_name || agency.id}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted">Unassigned</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-text">{owner.property_owned ?? 0}</td>
                        <td className="px-5 py-4 text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            color="inherit"
                            disabled={!assignmentAgencyId}
                            isLoading={isAssigningOwner && assigningOwnerId === owner.owner_id}
                            onClick={() => assignOwnerToSelectedAgency(owner.owner_id)}
                          >
                            Assign
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {ownerList.pagination ? (
              <div className="flex items-center justify-between gap-3 border-t border-secondary/10 px-5 py-4">
                <p className="text-sm text-muted">
                  Page {ownerList.pagination.page} of {ownerList.pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    color="inherit"
                    disabled={!ownerList.pagination.hasPrevious}
                    onClick={() => ownerList.onPageChange(ownerList.pagination!.page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    color="inherit"
                    disabled={!ownerList.pagination.hasNext}
                    onClick={() => ownerList.onPageChange(ownerList.pagination!.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </section>
        </>
      ) : (
        <OwnerList filters={listFilters} list={ownerList} />
      )}
    </div>
  );
}

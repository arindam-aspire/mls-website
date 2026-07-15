export type LeadListRow = {
  id: string;
  leadNumber: string;
  propertyTitle: string;
  customerName: string;
  status: string;
  assignedAgent: string;
  createdAtLabel: string;
  /** ISO or raw date string used for client-side sort. */
  createdAtSortValue: string;
};

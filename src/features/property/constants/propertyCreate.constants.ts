/** Query param on `/property-create` for an existing draft submission. */
export const PROPERTY_CREATE_SUBMISSION_ID_PARAM = "submission_id";

/** Query param on `/property-create` when an owner selects an agency. */
export const PROPERTY_CREATE_AGENCY_ID_PARAM = "agency_id";

/** PATCH `/property-submissions/{submissionId}` action for saving draft progress. */
export const PROPERTY_DRAFT_SUBMISSION_SAVE_ACTION = "save_draft" as const;
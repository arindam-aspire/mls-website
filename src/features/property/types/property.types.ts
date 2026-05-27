// ── Property list (GET /properties) ─────────────────────────────────────────

export type PropertyListParams = {
  page: number;
  pageSize: number;
  category: string;
  status: string;
};

export type PropertyListResponse = {
  success: boolean;
  message: string | null;
  data: unknown;
  error: unknown;
  meta: Record<string, unknown>;
};


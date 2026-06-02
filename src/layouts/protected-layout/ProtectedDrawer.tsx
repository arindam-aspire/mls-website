export function ProtectedDrawer() {
  return (
    <div className="pointer-events-none fixed inset-y-0 left-0 z-50 hidden w-72 border-r border-secondary/15 bg-surface p-4 xl:block">
      <div className="rounded-xl border border-secondary/15 bg-page p-4 text-sm text-muted">
        Protected Drawer Placeholder
      </div>
    </div>
  );
}

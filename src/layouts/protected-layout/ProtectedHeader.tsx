export function ProtectedHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-secondary/15 bg-page px-4 sm:h-20 sm:px-6">
      <div className="text-sm font-semibold text-text sm:text-base">
        Protected Header
      </div>

      <div className="text-xs text-muted sm:text-sm">Placeholder actions</div>
    </header>
  );
}

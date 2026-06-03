interface ProtectedMainProps {
  children: React.ReactNode;
}

export function ProtectedMain({ children }: ProtectedMainProps) {
  return (
    <main className="flex min-h-0 flex-1 flex-col bg-page px-4 py-4 sm:px-6 sm:py-6">
      {children}
    </main>
  );
}

"use client";

export function PublicMain({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-0 flex-1 flex-col px-6 py-4">
      <div className="container mx-auto w-full">{children}</div>
    </main>
  );
}

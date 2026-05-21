export function PublicMain({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="-mt-16 flex min-h-0 flex-1 flex-col sm:-mt-20">
      {children}
    </main>
  );
}

import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Geist, Geist_Mono, Tajawal } from "next/font/google";
import { isRtlLocale } from "@/src/i18n/routing";
import { AuthProvider } from "@/src/providers/AuthProvider";
import { ThemeProvider } from "@/src/providers/ThemeProvider";
import QueryProvider from "@/src/providers/QueryProvider";
import ToastProvider from "@/src/providers/ToastProvider";
import "./globals.css";
import { NavigationInitializer } from "@/src/initializers/NavigationInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "Multiple Listing Services",
  description: "Multiple Listing Services",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const direction = isRtlLocale(locale) ? "rtl" : "ltr";
  const fontClass = locale === "ar" ? "font-arabic" : "font-sans";

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${geistSans.variable} ${geistMono.variable} ${tajawal.variable} h-full antialiased`}
    >
      <body
        className={`flex min-h-full flex-col bg-page text-text ${fontClass}`}
      >
        <QueryProvider>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                <NavigationInitializer />
                <div className="flex min-h-0 flex-1 flex-col">{children}</div>
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

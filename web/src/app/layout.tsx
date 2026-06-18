import { getLocale } from "next-intl/server";
import "./globals.css";
import CursorGlowClient from "@/components/canvas/CursorGlowClient";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className="h-full grain" suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <CursorGlowClient />
      </body>
    </html>
  );
}

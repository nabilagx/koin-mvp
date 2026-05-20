import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KOIN MVP",
  description: "MVP tabungan dan transaksi kantin anak berbasis kartu."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

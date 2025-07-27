import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "../components/AppLayout";
import NavbarWrapper from "@/components/NavbarWrapper";

export const metadata: Metadata = {
  title: "Venus Sports Arena",
  description:
    "A platform for managing the turff booking, piplay booking, inventory management, event management and revenue analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className="dark" lang="en">
      <body>
        <NavbarWrapper />
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}

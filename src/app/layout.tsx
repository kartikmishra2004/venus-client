import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Venus Sports Arena ",
  description: "A platform for managing the turff booking, piplay booking, inventory management, event management and revenue analysis.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className="dark" lang="en">
      <body>
        <SidebarProvider>
          <Navbar />
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
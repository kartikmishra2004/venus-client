import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Venus Sports Arena ",
  description: "A platform for managing the turff booking, piplay booking, inventory management, event management and revenue analysis.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
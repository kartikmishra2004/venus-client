"use client";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <SidebarProvider>
            <div className="flex flex-col w-full">
                {children}
                {["/", "/blog", "/aboutus", "/termsandconditions", "/privacypolicy"].includes(pathname) && <Footer />}
            </div>
        </SidebarProvider>
    );
}

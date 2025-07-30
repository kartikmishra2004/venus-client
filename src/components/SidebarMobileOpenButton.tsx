import * as React from "react";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./ui/sidebar";

const SidebarMobileOpenButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
    className,
    ...props
}) => {
    const { openMobile, setOpenMobile, isMobile } = useSidebar();

    if (!isMobile || openMobile) return null;

    return (
        <button
            type="button"
            aria-label="Open sidebar"
            className={cn(
                "fixed top-20 left-0 z-50 rounded-r-lg flex h-10 w-6 items-center justify-center border text-sidebar-foreground bg-zinc-800 shadow-lg md:hidden",
                className
            )}
            onClick={() => setOpenMobile(true)}
            {...props}
        >
            <ChevronRightIcon />
        </button>
    );
};

export default SidebarMobileOpenButton;
'use client'
import { LandPlot, Gamepad2, ChartNoAxesCombined, Warehouse, CalendarDays, X } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { NavUser } from "./ui/nav-user"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"

const items = [
    {
        title: "Turf",
        url: "/dashboard/turf",
        icon: LandPlot,
    },
    {
        title: "PI Play",
        url: "/dashboard/piplay",
        icon: Gamepad2,
    },
    {
        title: "Inventory",
        url: "/dashboard/inventory",
        icon: Warehouse,
    },
    {
        title: "Events",
        url: "/dashboard/events",
        icon: CalendarDays,
    },
    {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: ChartNoAxesCombined,
    },
]

const user = {
    name: "Venus",
    email: "info@venussportsarena.com",
}

export function SideBar() {
    const pathname = usePathname()
    const { setOpenMobile, isMobile } = useSidebar();

    const handleCloseSidebar = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    }

    return (
        <Sidebar className="h-full">
            <SidebarContent>
                <SidebarGroup className="pt-18">
                    <div className="flex justify-between py-2">
                        <SidebarGroupLabel>Venus Sports Arena</SidebarGroupLabel>
                        {isMobile && <SidebarGroupLabel><X onClick={handleCloseSidebar} /></SidebarGroupLabel>}
                    </div>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = pathname.startsWith(item.url)
                                return (
                                    <SidebarMenuItem onClick={handleCloseSidebar} key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={clsx(
                                                "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                                                isActive
                                                    ? "bg-zinc-800 text-white"
                                                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                                            )}
                                        >
                                            <Link href={item.url}>
                                                <item.icon className="h-5 w-5" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    )
}

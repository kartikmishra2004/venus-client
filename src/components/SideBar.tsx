import { LandPlot, Gamepad2, ChartNoAxesCombined, Warehouse, CalendarDays } from "lucide-react"
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
} from "@/components/ui/sidebar"
import { NavUser } from "./ui/nav-user"
import Link from "next/link"

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
    return (
        <Sidebar className="pt-14">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Venus Sports Arena</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
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
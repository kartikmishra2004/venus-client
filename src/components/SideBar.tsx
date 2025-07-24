import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

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

const items = [
    {
        title: "Turf",
        url: "/dashboard/turf",
        icon: Home,
    },
    {
        title: "PI Play",
        url: "/dashboard/piplay",
        icon: Inbox,
    },
    {
        title: "Inventory",
        url: "/dashboard/inventory",
        icon: Calendar,
    },
    {
        title: "Events",
        url: "/dashboard/events",
        icon: Search,
    },
    {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: Settings,
    },
]

const user = {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
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
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
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
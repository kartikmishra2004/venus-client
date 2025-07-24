import { SideBar } from "@/components/SideBar";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex">
            <SideBar />
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}
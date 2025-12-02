import { Outlet } from "react-router-dom"
import { Sidebar } from "./sidebar"

export function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-muted/30">
        <Outlet />
      </main>
    </div>
  )
}

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DashboardPage } from "@/pages/dashboard"
import { ProvidersPage } from "@/pages/providers"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="providers" element={<ProvidersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { Dashboard } from '@/pages/Dashboard'
import { Orders } from '@/pages/Orders'
import { Vehicles } from '@/pages/Vehicles'
import { Drivers } from '@/pages/Drivers'
import { Tasks } from '@/pages/Tasks'
import { Products } from '@/pages/Products'
import { Invoices } from '@/pages/Invoices'
import { Toaster } from 'sonner'
import './App.css'

function App() {
  return (
    <Router>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <SiteHeader />
            <main className="flex-1 p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/drivers" element={<Drivers />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/products" element={<Products />} />
                <Route path="/invoices" element={<Invoices />} />
              </Routes>
            </main>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </Router>
  )
}

export default App

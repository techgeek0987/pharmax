import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useLocation } from "react-router-dom"
import { ModeToggle } from "./mode-toggle"

export function SiteHeader() {
  const location = useLocation()
  
  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/':
      case '/dashboard':
        return 'Dashboard'
      case '/orders':
        return 'Orders'
      case '/vehicles':
        return 'Vehicles'
      case '/drivers':
        return 'Drivers'
      case '/tasks':
        return 'Tasks'
      case '/products':
        return 'Products'
      case '/invoices':
        return 'Invoices'
      default:
        return 'PharmX'
    }
  }

  const getBreadcrumbs = (pathname: string) => {
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 0) return [{ label: 'Dashboard', href: '/dashboard' }]
    
    return segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/')
      const label = segment.charAt(0).toUpperCase() + segment.slice(1)
      return { label, href }
    })
  }

  const breadcrumbs = getBreadcrumbs(location.pathname)
  const pageTitle = getPageTitle(location.pathname)

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={breadcrumb.href} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={breadcrumb.href}>
                    {breadcrumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto">
      <ModeToggle />
      </div>
    </header>
  )
}
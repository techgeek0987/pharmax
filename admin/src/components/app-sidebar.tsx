import * as React from "react"
import { Link } from "react-router-dom"
import {
  IconTruck,
  IconChartBar,
  IconDashboard,
  IconPackage,
  IconFileInvoice,
  IconClipboardList,
  IconUsers,
  IconHelp,
  IconSettings,
  IconSearch,
  IconMedicalCross,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavCollapsible } from "@/components/nav-collapsible"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "PharmX Admin",
    email: "admin@pharmx.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: IconPackage,
    },
    {
      title: "Vehicles",
      url: "/vehicles",
      icon: IconTruck,
    },
    {
      title: "Drivers",
      url: "/drivers",
      icon: IconUsers,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: IconClipboardList,
    },
  ],
  navClouds: [
    {
      title: "Products",
      icon: IconMedicalCross,
      url: "/products",
      items: [
        {
          title: "All Products",
          url: "/products",
        },
        {
          title: "Low Stock",
          url: "/products?filter=low-stock",
        },
        {
          title: "Out of Stock",
          url: "/products?filter=out-of-stock",
        },
      ],
    },
    {
      title: "Invoices",
      icon: IconFileInvoice,
      url: "/invoices",
      items: [
        {
          title: "All Invoices",
          url: "/invoices",
        },
        {
          title: "Pending",
          url: "/invoices?status=pending",
        },
        {
          title: "Overdue",
          url: "/invoices?status=overdue",
        },
      ],
    },
    {
      title: "Analytics",
      icon: IconChartBar,
      url: "/analytics",
      items: [
        {
          title: "Order Analytics",
          url: "/analytics/orders",
        },
        {
          title: "Driver Performance",
          url: "/analytics/drivers",
        },
        {
          title: "Vehicle Utilization",
          url: "/analytics/vehicles",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Help & Support",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/search",
      icon: IconSearch,
    },
  ],
  documents: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <IconMedicalCross className="!size-5" />
                <span className="text-base font-semibold">PharmX Dashboard</span>
               
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavCollapsible items={data.navClouds} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

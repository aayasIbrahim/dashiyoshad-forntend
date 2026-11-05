import type { SidebarItems } from "@/types";

const prefix = "/admin";

export const adminRoutes: SidebarItems = [
  {
    title: "Dashboard",
    items: [{ title: "Overview", url: prefix }],
  },
  {
    title: "Catalog",
    items: [
      { title: "Products", url: `${prefix}/products` },
      { title: "Categories", url: `${prefix}/categories` },
    ],
  },
  {
    title: "Sales",
    items: [{ title: "Orders", url: `${prefix}/orders` }],
  },
  {
    title: "Administration",
    items: [{ title: "Notifications", url: `${prefix}/notifications` }],
  },
];
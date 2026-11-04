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
      { title: "Inventory", url: `${prefix}/inventory` },
    ],
  },
  {
    title: "Sales",
    items: [
      { title: "Orders", url: `${prefix}/orders` },
      { title: "Discounts", url: `${prefix}/discounts` },
    ],
  },
  {
    title: "Customers",
    items: [{ title: "All customers", url: `${prefix}/customers` }],
  },
  {
    title: "Insights",
    items: [{ title: "Analytics", url: `${prefix}/analytics` }],
  },
  {
    title: "Store",
    items: [{ title: "Settings", url: `${prefix}/settings` }],
  },
];

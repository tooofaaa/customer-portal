import { StoreIcon, OrdersIcon, ShoppingCartIcon, ProductsIcon } from "./icons";

export const MAIN_NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: StoreIcon },
  { href: "/suppliers", label: "Suppliers", icon: ProductsIcon },
  { href: "/orders", label: "My Orders", icon: OrdersIcon },
  { href: "/cart", label: "Cart", icon: ShoppingCartIcon },
];

export const FOOTER_NAV_LINKS = [
  { href: "/profile", label: "Profile", icon: StoreIcon },
  { href: "/settings", label: "Settings", icon: StoreIcon },
];

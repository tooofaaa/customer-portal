import { StoreIcon, OrdersIcon, ShoppingCartIcon, ProductsIcon, WalletIcon, ActivityIcon } from "./icons";

export const MAIN_NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: StoreIcon },
  { href: "/suppliers", label: "Suppliers", icon: ProductsIcon },
  { href: "/orders", label: "My Orders", icon: OrdersIcon },
  { href: "/cart", label: "Cart", icon: ShoppingCartIcon },
  { href: "/wallet", label: "Wallet", icon: WalletIcon },
  { href: "/membership", label: "Membership", icon: ActivityIcon },
  { href: "/warehouse", label: "Warehouse", icon: StoreIcon },
];

export const FOOTER_NAV_LINKS = [
  { href: "/profile", label: "Profile", icon: StoreIcon },
  { href: "/settings", label: "Settings", icon: StoreIcon },
];

import { BriefcaseBusiness, Home, LucideIcon, NotebookPen, ShoppingCart, UsersIcon, Wallet } from "lucide-react";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const SIDEBAR_MENU_ITEMS: {
    key: string;
    label: string;
    href: string;
    highlight: (pathname: string, baseUrl: string) => boolean;
    Icon: LucideIcon
}[] = [
        {
            key: "home",
            label: "Home",
            href: ``,
            highlight: (pathname: string, baseUrl: string) => pathname === `${baseUrl}`,
            Icon: Home,
        },
        {
            key: "customers",
            label: "Clientes",
            href: `/customers`,
            highlight: (pathname: string, baseUrl: string) => pathname.includes(`${baseUrl}/customers`),
            Icon: UsersIcon,
        },
        {
            key: "products",
            label: "Produtos",
            href: `/products`,
            highlight: (pathname: string, baseUrl: string) => pathname === `${baseUrl}/products`,
            Icon: ShoppingCart,
        },
        {
            key: "services",
            label: "Serviços",
            href: `/services`,
            highlight: (pathname: string, baseUrl: string) => pathname.includes(`${baseUrl}/services`),
            Icon: BriefcaseBusiness,
        },
        {
            key: "proposals",
            label: "Propostas",
            href: `/proposals`,
            highlight: (pathname: string, baseUrl: string) => pathname === `${baseUrl}/proposals`,
            Icon: NotebookPen,
        },
        {
            key: "financial",
            label: "Financeiro",
            href: `/financial`,
            highlight: (pathname: string, baseUrl: string) => pathname === `${baseUrl}/financial`,
            Icon: Wallet,
        },
    ];
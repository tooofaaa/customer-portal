"use client";

import NavItem from "@/components/ui/NavItem";
import { LogOutIcon } from "@/lib/icons";
import { MAIN_NAV_LINKS, FOOTER_NAV_LINKS } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { logoutCustomer } from "@/lib/actions/auth";

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function MobileSidebar({ isOpen, setIsOpen }: MobileSidebarProps) {
  const { t, isRTL } = useLanguage();
  const navLabels = t.nav;

  const navLabelMap: Record<string, string> = {
    "/dashboard": navLabels.dashboard,
    "/suppliers": navLabels.suppliers,
    "/orders": navLabels.orders,
    "/cart": navLabels.cart,
    "/profile": navLabels.profile,
    "/settings": navLabels.settings,
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 z-50 w-64 bg-[#131720] flex flex-col justify-between transition-transform duration-300 md:hidden py-6 px-4`}
        style={{
          background: "linear-gradient(180deg, #0f1117 0%, #131720 100%)",
          borderRight: isRTL ? "none" : "1px solid rgba(99,102,241,0.15)",
          borderLeft: isRTL ? "1px solid rgba(99,102,241,0.15)" : "none",
          left: isRTL ? "auto" : 0,
          right: isRTL ? 0 : "auto",
          transform: isOpen
            ? "translateX(0)"
            : isRTL
            ? "translateX(100%)"
            : "translateX(-100%)",
        }}
      >
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-3 px-2 pb-7 mb-1">
            <div
              className="p-2.5 rounded-xl flex-shrink-0 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
                boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-tight">
                {t.brandName}
              </p>
              <p className="text-xs leading-tight" style={{ color: "#6366f1" }}>
                {t.brandTagline}
              </p>
            </div>
          </div>

          <div
            className="mx-2 mb-5"
            style={{ height: "1px", background: "rgba(255,255,255,0.07)" }}
          />

          <nav className="flex flex-col gap-1 overflow-y-auto">
            <div onClick={() => setIsOpen(false)}>
              {MAIN_NAV_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <NavItem
                    key={link.href}
                    href={link.href}
                    label={navLabelMap[link.href] ?? link.label}
                    icon={<Icon className="w-5 h-5" />}
                  />
                );
              })}
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <div
            className="mx-2 mb-3"
            style={{ height: "1px", background: "rgba(255,255,255,0.07)" }}
          />

          <div onClick={() => setIsOpen(false)}>
            {FOOTER_NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <NavItem
                  key={link.href}
                  href={link.href}
                  label={navLabelMap[link.href] ?? link.label}
                  icon={<Icon className="w-5 h-5" />}
                />
              );
            })}
          </div>

          <button
            onClick={async () => {
              await logoutCustomer();
              window.location.href = '/login';
            }}
            className="w-full cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mt-2"
            style={{ color: "rgba(239,68,68,0.8)" }}
          >
            <LogOutIcon className="w-5 h-5 flex-shrink-0" />
            <span>{navLabels.logOut}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

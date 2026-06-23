"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { StoreIcon, ProductsIcon, OrdersIcon } from "@/lib/icons";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t, isRTL } = useLanguage();

  return (
    <div className="flex min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div
        className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0f1117 0%, #131720 100%)",
        }}
      >
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow effect */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px] z-0 pointer-events-none"
        />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="p-3 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #6366f1, #818cf8)",
              boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <div>
            <h1 className="text-white text-xl font-bold tracking-wide">
              {t.brandName}
            </h1>
            <p className="text-indigo-400 text-sm font-medium">
              {t.brandTagline}
            </p>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 mt-12">
          <h2 className="text-4xl font-bold text-white leading-tight mb-6">
            Empower your procurement <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
              with top suppliers
            </span>
          </h2>
          
          <div className="flex flex-col gap-6 mt-10">
            {[
              { icon: StoreIcon, title: "Curated Suppliers", desc: "Access a verified network of top-tier partners." },
              { icon: ProductsIcon, title: "Extensive Catalogs", desc: "Browse thousands of products in one place." },
              { icon: OrdersIcon, title: "Seamless Ordering", desc: "Track POs and shipments with real-time updates." },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{feature.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 flex items-center justify-between text-gray-500 text-sm">
          <p>© 2026 Jupi Solutions. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel - Form (Full width on mobile) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-[#f8f9fc]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center justify-center gap-4 mb-10 text-center">
            <div
              className="p-3.5 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
                boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-wide">
                {t.brandName}
              </h1>
              <p className="text-indigo-600 text-sm font-medium">
                {t.brandTagline}
              </p>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

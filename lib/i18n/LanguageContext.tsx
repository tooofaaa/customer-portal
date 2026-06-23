"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  isRTL: boolean;
  t: any;
}

const translations = {
  en: {
    brandName: "Customer Portal",
    brandTagline: "Shop with top suppliers",
    nav: {
      dashboard: "Dashboard",
      suppliers: "Suppliers",
      orders: "My Orders",
      cart: "Cart",
      profile: "Profile",
      settings: "Settings",
      logOut: "Log Out",
    },
    common: {
      search: "Search",
      noData: "No data available",
    },
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome back",
      totalSpent: "Total Spent",
      activeOrders: "Active Orders",
      completedOrders: "Completed Orders",
      suppliers: "Saved Suppliers",
      recentOrders: "Recent Orders",
    },
    login: {
      title: "Welcome Back",
      subtitle: "Sign in to access your customer account",
      email: "Email Address",
      emailPlaceholder: "you@example.com",
      password: "Password",
      passwordPlaceholder: "••••••••",
      signIn: "Sign In",
      signingIn: "Signing In...",
    },
    orders: {
      poCode: "PO Code",
      status: "Status",
      items: "Items",
      totalCost: "Total Cost",
      expectedDelivery: "Delivery Date",
      supplier: "Supplier",
      filterAll: "All",
      filterPending: "Pending",
      filterProcessing: "Processing",
      filterShipped: "Shipped",
      filterDelivered: "Delivered",
      noOrders: "You have no orders matching the criteria.",
    }
  },
  ar: {
    brandName: "بوابة العملاء",
    brandTagline: "تسوق مع أفضل الموردين",
    nav: {
      dashboard: "لوحة القيادة",
      suppliers: "الموردين",
      orders: "طلباتي",
      cart: "عربة التسوق",
      profile: "الملف الشخصي",
      settings: "الإعدادات",
      logOut: "تسجيل الخروج",
    },
    common: {
      search: "بحث",
      noData: "لا توجد بيانات متاحة",
    },
    dashboard: {
      title: "لوحة القيادة",
      welcome: "مرحباً بعودتك",
      totalSpent: "إجمالي الإنفاق",
      activeOrders: "طلبات نشطة",
      completedOrders: "الطلبات المكتملة",
      suppliers: "الموردين المحفوظين",
      recentOrders: "الطلبات الأخيرة",
    },
    login: {
      title: "مرحباً بعودتك",
      subtitle: "قم بتسجيل الدخول للوصول إلى حساب العميل الخاص بك",
      email: "البريد الإلكتروني",
      emailPlaceholder: "you@example.com",
      password: "كلمة المرور",
      passwordPlaceholder: "••••••••",
      signIn: "تسجيل الدخول",
      signingIn: "جاري تسجيل الدخول...",
    },
    orders: {
      poCode: "رمز الطلب",
      status: "الحالة",
      items: "العناصر",
      totalCost: "التكلفة الإجمالية",
      expectedDelivery: "تاريخ التسليم",
      supplier: "المورد",
      filterAll: "الكل",
      filterPending: "قيد الانتظار",
      filterProcessing: "قيد المعالجة",
      filterShipped: "تم الشحن",
      filterDelivered: "تم التوصيل",
      noOrders: "ليس لديك طلبات تطابق المعايير.",
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("portal-lang") as Language;
    if (saved === "ar" || saved === "en") setLanguage(saved);
  }, []);

  const toggleLanguage = () => {
    const next = language === "en" ? "ar" : "en";
    setLanguage(next);
    localStorage.setItem("portal-lang", next);
  };

  const isRTL = language === "ar";
  const t = translations[language];

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language: "en", toggleLanguage: () => {}, isRTL: false, t: translations.en }}>
        <div style={{ visibility: "hidden" }}>{children}</div>
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

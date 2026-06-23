"use client";

import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";

export default function ConfirmEmailPage() {
  const { t } = useLanguage();
  const l = t.confirm;

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 text-center items-center justify-center py-12">
      <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          {l.title}
        </h2>
        <p className="text-gray-500 mt-4 text-sm font-medium max-w-sm mx-auto leading-relaxed">
          {l.subtitle}
        </p>
      </div>

      <div className="mt-6 w-full">
        <Link href="/login" className="block w-full">
          <Button variant="secondary" className="w-full py-3.5 text-sm">
            {l.backToLogin}
          </Button>
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6 max-w-4xl pb-10">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
          {t.nav.profile}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
          Manage your personal and company details
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Col - Avatar & Summary */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div
            className="rounded-2xl p-6 flex flex-col items-center text-center bg-white"
            style={{
              border: "1px solid rgba(99,102,241,0.1)",
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div className="w-24 h-24 rounded-full mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg"
              style={{
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
              }}
            >
              C
            </div>
            <h2 className="text-lg font-bold text-gray-900">John Doe</h2>
            <p className="text-sm text-indigo-500 font-medium">Procurement Manager</p>
            <p className="text-xs text-gray-400 mt-1">Jupi Enterprises</p>
            
            <div className="w-full mt-6 flex flex-col gap-2">
              <Button variant="secondary" className="w-full text-xs py-2">Change Avatar</Button>
            </div>
          </div>
        </div>

        {/* Right Col - Form fields */}
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          <div
            className="rounded-2xl p-6 bg-white"
            style={{
              border: "1px solid rgba(99,102,241,0.1)",
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
            }}
          >
            <h3 className="font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500">First Name</label>
                <input type="text" defaultValue="John" className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500">Last Name</label>
                <input type="text" defaultValue="Doe" className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500">Email Address</label>
                <input type="email" defaultValue="john.doe@jupienterprises.com" className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500">Phone Number</label>
                <input type="tel" defaultValue="+971 50 123 4567" className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
            </div>

            <h3 className="font-bold text-gray-900 mt-8 mb-6 border-b border-gray-100 pb-4">Company Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500">Company Name</label>
                <input type="text" defaultValue="Jupi Enterprises LLC" className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500">Default Delivery Address</label>
                <textarea rows={3} defaultValue="Office Tower B, Floor 14, Dubai Marina, Dubai, UAE" className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none" />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Button variant="ghost">Cancel</Button>
              <Button variant="primary">Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

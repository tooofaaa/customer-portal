"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6 max-w-4xl pb-10">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
          {t.nav.settings}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
          Configure your portal preferences and notifications
        </p>
      </div>

      <div
        className="rounded-2xl p-6 bg-white"
        style={{
          border: "1px solid rgba(99,102,241,0.1)",
          boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
        }}
      >
        <h3 className="font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Notifications</h3>
        
        <div className="flex flex-col gap-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="mt-1 accent-indigo-500 w-4 h-4 rounded" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Order Updates</p>
              <p className="text-xs text-gray-500">Get notified when your order status changes (e.g., Shipped, Delivered).</p>
            </div>
          </label>
          
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="mt-1 accent-indigo-500 w-4 h-4 rounded" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Supplier Promotions</p>
              <p className="text-xs text-gray-500">Receive emails about new products and discounts from your favorite suppliers.</p>
            </div>
          </label>
          
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-1 accent-indigo-500 w-4 h-4 rounded" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Weekly Summary</p>
              <p className="text-xs text-gray-500">Get a weekly email summarizing your total spending and pending orders.</p>
            </div>
          </label>
        </div>

        <h3 className="font-bold text-gray-900 mt-8 mb-6 border-b border-gray-100 pb-4">Security</h3>
        
        <div className="flex items-center justify-between py-2 border-b border-gray-50">
          <div>
            <p className="text-sm font-semibold text-gray-900">Password</p>
            <p className="text-xs text-gray-500">Last changed 3 months ago</p>
          </div>
          <Button variant="secondary" className="text-xs px-3 py-1.5">Change Password</Button>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-50 mt-2">
          <div>
            <p className="text-sm font-semibold text-gray-900">Two-Factor Authentication (2FA)</p>
            <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
          </div>
          <Button variant="secondary" className="text-xs px-3 py-1.5">Enable 2FA</Button>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button variant="ghost">Reset to Defaults</Button>
          <Button variant="primary">Save Preferences</Button>
        </div>
      </div>
    </div>
  );
}

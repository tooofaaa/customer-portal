"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const { t } = useLanguage();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setEmail(user.email || "");
          
          const { data, error } = await supabase
            .from("portal_customers")
            .select("*")
            .eq("id", user.id)
            .single();

          if (data) {
            const nameParts = (data.name || "").split(" ");
            setFirstName(nameParts[0] || "");
            setLastName(nameParts.slice(1).join(" ") || "");
            setPhone(data.phone_number || "");
            setCompanyName(data.company_name || "");
            setDeliveryAddress(data.delivery_address || "");
          } else {
            // Fallback if no custom profile details yet
            const nameParts = (user.user_metadata?.name || "").split(" ");
            setFirstName(nameParts[0] || "");
            setLastName(nameParts.slice(1).join(" ") || "");
          }
        }
      } catch (err: any) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const fullName = `${firstName} ${lastName}`.trim();
    if (!fullName) {
      setMessage({ type: "error", text: "First name and last name cannot be empty." });
      setIsSaving(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage({ type: "error", text: "Not authenticated" });
        setIsSaving(false);
        return;
      }

      // 1. Update portal_customers details
      const { error: custError } = await supabase
        .from("portal_customers")
        .update({
          name: fullName,
          phone_number: phone,
          company_name: companyName,
          delivery_address: deliveryAddress,
        })
        .eq("id", user.id);

      if (custError) throw custError;

      // 2. Also update public.users name for sync
      const { error: userError } = await supabase
        .from("users")
        .update({ name: fullName })
        .eq("id", user.id);

      if (userError) throw userError;

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      setMessage({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500">Loading your profile details...</p>
      </div>
    );
  }

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

      {message && (
        <div
          className={`p-4 rounded-xl text-sm border font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-8">
        {/* Left Col - Avatar & Summary */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div
            className="rounded-2xl p-6 flex flex-col items-center text-center bg-white"
            style={{
              border: "1px solid rgba(99,102,241,0.1)",
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="w-24 h-24 rounded-full mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg"
              style={{
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
              }}
            >
              {(firstName || "C").charAt(0).toUpperCase()}
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {firstName} {lastName}
            </h2>
            <p className="text-sm text-indigo-500 font-medium">Procurement Manager</p>
            <p className="text-xs text-gray-400 mt-1">{companyName || "No Company Specified"}</p>
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
            <h3 className="font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="px-3 py-2 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., +971 50 123 4567"
                  className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <h3 className="font-bold text-gray-900 mt-8 mb-6 border-b border-gray-100 pb-4">
              Company Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Jupi Enterprises LLC"
                  className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500">
                  Default Delivery Address
                </label>
                <textarea
                  rows={3}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g., Office Tower B, Floor 14, Dubai Marina, Dubai, UAE"
                  className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => window.location.reload()}>
                Reset
              </Button>
              <Button type="submit" variant="primary" isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}


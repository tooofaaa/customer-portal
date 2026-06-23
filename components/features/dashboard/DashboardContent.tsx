"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import StatCard from "@/components/ui/StatCard";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { OrdersIcon, ClockIcon, CheckCircleIcon, StoreIcon } from "@/lib/icons";
import { MOCK_ORDERS } from "@/lib/mockData";
import Link from "next/link";

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Pending: { bg: "rgba(245,158,11,0.1)", color: "#d97706" },
  Processing: { bg: "rgba(59,130,246,0.1)", color: "#2563eb" },
  Shipped: { bg: "rgba(139,92,246,0.1)", color: "#8b5cf6" },
  Delivered: { bg: "rgba(16,185,129,0.1)", color: "#059669" },
};

export default function DashboardContent() {
  const { t } = useLanguage();
  const d = t.dashboard;

  const totalSpent = MOCK_ORDERS.reduce((sum, o) => sum + o.totalCost, 0);
  const activeOrders = MOCK_ORDERS.filter((o) => o.status !== "Delivered").length;
  const completedOrders = MOCK_ORDERS.filter((o) => o.status === "Delivered").length;

  const statCards = [
    {
      title: d.totalSpent,
      value: formatCurrency(totalSpent),
      accent: "#6366f1",
      icon: <OrdersIcon className="w-4 h-4" />,
      description: "All time purchases",
    },
    {
      title: d.activeOrders,
      value: activeOrders,
      accent: "#f59e0b",
      icon: <ClockIcon className="w-4 h-4" />,
      description: "Currently in progress",
    },
    {
      title: d.completedOrders,
      value: completedOrders,
      accent: "#10b981",
      icon: <CheckCircleIcon className="w-4 h-4" />,
      description: "Successfully delivered",
    },
    {
      title: d.suppliers,
      value: 6,
      accent: "#ec4899",
      icon: <StoreIcon className="w-4 h-4" />,
      description: "Suppliers you buy from",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
          {d.title}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
          {d.welcome} 👋 — here&apos;s your purchasing overview
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            accent={card.accent}
            icon={card.icon}
            description={card.description}
          />
        ))}
      </div>

      {/* Recent Orders */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.95)",
          border: "1px solid rgba(99,102,241,0.1)",
          boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(99,102,241,0.08)" }}
        >
          <h2 className="font-semibold text-base" style={{ color: "#0f172a" }}>
            {d.recentOrders}
          </h2>
          <Link
            href="/orders"
            className="text-xs font-semibold transition-colors duration-200"
            style={{ color: "#6366f1" }}
          >
            View all →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "rgba(248,249,252,0.8)" }}>
                {[t.orders.poCode, t.orders.supplier, t.orders.status, t.orders.totalCost, t.orders.expectedDelivery].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "#94a3b8" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.slice(0, 5).map((order, i) => {
                const style = STATUS_STYLES[order.status] ?? { bg: "#f1f5f9", color: "#64748b" };
                return (
                  <tr
                    key={order.id}
                    style={{
                      borderTop: i > 0 ? "1px solid rgba(99,102,241,0.06)" : undefined,
                    }}
                  >
                    <td className="px-6 py-4 font-mono font-semibold text-xs" style={{ color: "#6366f1" }}>
                      {order.poCode}
                    </td>
                    <td className="px-6 py-4 font-medium" style={{ color: "#0f172a" }}>
                      {order.supplierName}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: style.bg, color: style.color }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold" style={{ color: "#0f172a" }}>
                      {formatCurrency(order.totalCost)}
                    </td>
                    <td className="px-6 py-4" style={{ color: "#475569" }}>
                      {formatDate(order.expectedDelivery)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

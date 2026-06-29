"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import StatCard from "@/components/ui/StatCard";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { OrdersIcon, ClockIcon, CheckCircleIcon, StoreIcon, WalletIcon, ActivityIcon } from "@/lib/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Order, Product } from "@/lib/types";
import { getCustomerWallet } from "@/lib/actions/wallet";
import { getCustomerMembership } from "@/lib/actions/membership";

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Pending: { bg: "rgba(245,158,11,0.1)", color: "#d97706" },
  Processing: { bg: "rgba(59,130,246,0.1)", color: "#2563eb" },
  Shipped: { bg: "rgba(139,92,246,0.1)", color: "#8b5cf6" },
  Delivered: { bg: "rgba(16,185,129,0.1)", color: "#059669" },
};

export default function DashboardContent() {
  const { t } = useLanguage();
  const d = t.dashboard;

  const [orders, setOrders] = useState<Order[]>([]);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [membershipTier, setMembershipTier] = useState<string>("Bronze");
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      
      const [ordersRes, suppliersRes, walletRes, membershipRes, productsRes] = await Promise.all([
        supabase.from('orders').select('*, suppliers(supplier_name)').order('created_at', { ascending: false }),
        supabase.from('suppliers').select('id', { count: 'exact', head: true }),
        getCustomerWallet(),
        getCustomerMembership(),
        supabase.from('products').select('*, suppliers(supplier_name)').limit(3)
      ]);

      if (ordersRes.data) {
        setOrders(ordersRes.data.map(o => ({
          id: o.id,
          poCode: o.po_code,
          supplierId: o.supplier_id,
          supplierName: o.suppliers?.supplier_name || 'Unknown',
          status: o.status,
          items: [],
          totalCost: o.total_cost,
          createdAt: o.created_at,
          expectedDelivery: o.expected_delivery_date
        })) as Order[]);
      }
      
      if (suppliersRes.count !== null) {
        setTotalSuppliers(suppliersRes.count);
      }

      if (walletRes.data) {
        setWalletBalance(walletRes.data.balance);
      }

      if (membershipRes.data?.level) {
        setMembershipTier(membershipRes.data.level.level_name);
      }

      if (productsRes.data) {
        setRecommendations(productsRes.data.map(p => ({
          id: p.id,
          supplierId: p.supplier_id,
          supplierName: p.suppliers?.supplier_name || 'Unknown',
          name: p.product_name,
          description: p.description || '',
          price: p.sell_price,
          unit: p.product_type || 'Unit',
          imageUrl: p.product_image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80',
          category: p.product_category,
          inStock: p.amount_stock > 0,
          minOrderQty: p.moq || 1
        })));
      }
      
      setIsLoading(false);
    }
    
    fetchData();
  }, []);

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.totalCost), 0);
  const activeOrders = orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled").length;

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
      description: "In progress shipments",
    },
    {
      title: "Wallet Balance",
      value: formatCurrency(walletBalance),
      accent: "#10b981",
      icon: <WalletIcon className="w-4 h-4" />,
      description: "Available credit",
    },
    {
      title: "Membership Status",
      value: membershipTier,
      accent: "#ec4899",
      icon: <ActivityIcon className="w-4 h-4" />,
      description: "Active reward tier",
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
            value={isLoading ? "..." : card.value}
            accent={card.accent}
            icon={card.icon}
            description={card.description}
          />
        ))}
      </div>

      {/* Main Grid: Orders & Activity/Recommendations */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Recent Orders */}
        <div
          className="xl:col-span-2 rounded-2xl overflow-hidden flex flex-col justify-between"
          style={{
            background: "rgba(255,255,255,0.95)",
            border: "1px solid rgba(99,102,241,0.1)",
            boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
          }}
        >
          <div>
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
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        Loading orders...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.slice(0, 5).map((order, i) => {
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
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recommendations & Quick Links */}
        <div className="flex flex-col gap-6">
          
          {/* Recommended Products */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(99,102,241,0.1)",
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
            }}
          >
            <h3 className="font-semibold text-base mb-4" style={{ color: "#0f172a" }}>
              Recommended Products
            </h3>
            <div className="flex flex-col gap-4">
              {isLoading ? (
                <p className="text-sm text-gray-500">Loading recommendations...</p>
              ) : recommendations.length === 0 ? (
                <p className="text-sm text-gray-500">No products recommended yet.</p>
              ) : (
                recommendations.map((prod) => (
                  <div key={prod.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <img src={prod.imageUrl} alt={prod.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-slate-800">{prod.name}</p>
                      <p className="text-xs text-indigo-500 truncate">{prod.supplierName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">{formatCurrency(prod.price)}</p>
                      <Link href={`/suppliers/${prod.supplierId}`} className="text-[10px] font-semibold text-indigo-600 hover:underline">
                        Buy
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(99,102,241,0.1)",
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
            }}
          >
            <h3 className="font-semibold text-base mb-4" style={{ color: "#0f172a" }}>
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/wallet" className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:bg-slate-50 transition-colors">
                <span className="text-xl">💳</span>
                <span className="text-xs font-semibold mt-2 text-slate-700">Wallet</span>
              </Link>
              <Link href="/membership" className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:bg-slate-50 transition-colors">
                <span className="text-xl">🏆</span>
                <span className="text-xs font-semibold mt-2 text-slate-700">Membership</span>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

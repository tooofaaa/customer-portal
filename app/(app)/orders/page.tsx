"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { SearchIcon, FilterIcon } from "@/lib/icons";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { Order } from "@/lib/types";

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Pending: { bg: "rgba(245,158,11,0.1)", color: "#d97706" },
  Processing: { bg: "rgba(59,130,246,0.1)", color: "#2563eb" },
  Shipped: { bg: "rgba(139,92,246,0.1)", color: "#8b5cf6" },
  Delivered: { bg: "rgba(16,185,129,0.1)", color: "#059669" },
};

const FILTERS = ["All", "Pending", "Processing", "Shipped", "Delivered"];

interface DBOrderItem {
  quantity: number;
  products: {
    product_name: string;
  } | null;
}

interface DBPurchaseOrder {
  id: string | number;
  po_code: string;
  status: string;
  total_cost: number;
  created_at: string;
  expected_delivery_date: string | null;
  supplier_id: string | number;
  suppliers: {
    supplier_name: string;
  } | null;
  order_items: DBOrderItem[] | null;
}

export default function OrdersPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("All");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const supabase = createClient();
      const { data } = await supabase.from('orders').select(`
        id,
        po_code,
        status,
        total_cost,
        created_at,
        expected_delivery_date,
        supplier_id,
        suppliers (supplier_name),
        order_items (
          quantity,
          products (product_name)
        )
      `).order('created_at', { ascending: false });

      if (data) {
        const mappedOrders = (data as unknown as DBPurchaseOrder[]).map((o) => {
          const items = o.order_items?.map((i) => ({
            productName: i.products?.product_name || '',
            quantity: i.quantity,
          })) || [];

          return {
            id: o.id,
            poCode: o.po_code,
            supplierId: o.supplier_id,
            supplierName: o.suppliers?.supplier_name || 'Unknown',
            status: o.status,
            totalCost: o.total_cost,
            createdAt: o.created_at,
            expectedDelivery: o.expected_delivery_date,
            items: items,
          } as Order;
        });
        setOrders(mappedOrders);
      }
      setIsLoading(false);
    }
    
    loadOrders();
  }, []);

  const filteredOrders = filter === "All"
    ? orders
    : orders.filter(o => o.status === filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
            {t.nav.orders}
          </h1>
          <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
            Track and manage your purchasing history
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t.common.search + " orders..."}
              className="pl-9 pr-4 py-2 rounded-xl text-sm w-full md:w-64 transition-all"
              style={{
                background: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(99,102,241,0.2)",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = "0 0 0 2px rgba(99,102,241,0.2)";
                e.target.style.borderColor = "#6366f1";
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = "none";
                e.target.style.borderColor = "rgba(99,102,241,0.2)";
              }}
            />
          </div>
          <Button variant="secondary" className="px-3">
            <FilterIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {FILTERS.map((f) => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
              style={
                isActive
                  ? {
                      background: "linear-gradient(135deg, #6366f1, #818cf8)",
                      color: "white",
                      boxShadow: "0 4px 15px rgba(99,102,241,0.35)",
                    }
                  : {
                      background: "rgba(255,255,255,0.8)",
                      color: "#64748b",
                      border: "1px solid rgba(99,102,241,0.15)",
                    }
              }
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.95)",
          border: "1px solid rgba(99,102,241,0.1)",
          boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "rgba(248,249,252,0.8)" }}>
                {[t.orders.poCode, t.orders.supplier, t.orders.items, t.orders.status, t.orders.totalCost, t.orders.expectedDelivery].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest whitespace-nowrap"
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
                  <td colSpan={6} className="px-6 py-12 text-center text-sm" style={{ color: "#64748b" }}>
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order, i) => {
                  const style = STATUS_STYLES[order.status] ?? { bg: "#f1f5f9", color: "#64748b" };
                  const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  
                  return (
                    <tr
                      key={order.id}
                      className="group transition-colors hover:bg-indigo-50/30"
                      style={{
                        borderTop: i > 0 ? "1px solid rgba(99,102,241,0.06)" : undefined,
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="font-mono font-semibold text-xs" style={{ color: "#6366f1" }}>
                          {order.poCode}
                        </div>
                        <div className="text-xs mt-1" style={{ color: "#94a3b8" }}>
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold" style={{ color: "#0f172a" }}>
                          {order.supplierName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium" style={{ color: "#475569" }}>
                          {itemsCount} units
                        </div>
                        <div className="text-xs truncate max-w-[150px] mt-0.5" style={{ color: "#94a3b8" }}>
                          {order.items.map(i => i.productName).join(", ")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                          style={{ background: style.bg, color: style.color }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold" style={{ color: "#0f172a" }}>
                        {formatCurrency(order.totalCost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" style={{ color: "#475569" }}>
                        {formatDate(order.expectedDelivery)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm" style={{ color: "#64748b" }}>
                    {t.orders.noOrders}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

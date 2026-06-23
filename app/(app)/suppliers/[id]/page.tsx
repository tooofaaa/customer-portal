"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { MOCK_SUPPLIERS, MOCK_PRODUCTS } from "@/lib/mockData";
import { useCart } from "@/lib/context/CartContext";
import { formatCurrency } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function SupplierDetailsPage() {
  const { t } = useLanguage();
  const { id } = useParams() as { id: string };
  const supplier = MOCK_SUPPLIERS.find(s => s.id === id);
  const products = MOCK_PRODUCTS[id] || [];
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  if (!supplier) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Supplier Not Found</h2>
        <p className="text-gray-500 mb-6">The supplier you are looking for does not exist.</p>
        <Link href="/suppliers">
          <Button variant="primary">Back to Suppliers</Button>
        </Link>
      </div>
    );
  }

  const handleAdd = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const qty = quantities[productId] || product.minOrderQty;
      addToCart(product, qty);
      // Reset quantity input
      setQuantities(prev => ({ ...prev, [productId]: product.minOrderQty }));
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Back link */}
      <Link href="/suppliers" className="text-sm font-semibold text-indigo-500 hover:text-indigo-600 inline-flex items-center gap-1 w-fit">
        ← Back to Suppliers
      </Link>

      {/* Supplier Header */}
      <div
        className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center"
        style={{
          background: "linear-gradient(135deg, #0f1117 0%, #131720 100%)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white flex-shrink-0 shadow-lg border border-white/10">
          <img src={supplier.logoUrl} alt={supplier.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 text-white">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{supplier.name}</h1>
            <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-500/20">
              ★ {supplier.rating}
            </span>
          </div>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-3xl">
            {supplier.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-medium text-gray-300">
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-400">📍</span> {supplier.location}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-400">⏱</span> {supplier.deliveryTime} delivery
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200">
          All Products
        </span>
        {supplier.categories.map(cat => (
          <span key={cat} className="px-4 py-2 rounded-xl text-sm font-semibold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors whitespace-nowrap">
            {cat}
          </span>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div
            key={product.id}
            className="flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-white"
            style={{
              border: "1px solid rgba(99,102,241,0.1)",
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
              {!product.inStock && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold text-sm border border-red-200">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{product.category}</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{product.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                {product.description}
              </p>
              
              <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-gray-500">Qty:</label>
                  <input
                    type="number"
                    min={product.minOrderQty}
                    value={quantities[product.id] || product.minOrderQty}
                    onChange={(e) => setQuantities(prev => ({ ...prev, [product.id]: parseInt(e.target.value) || product.minOrderQty }))}
                    disabled={!product.inStock}
                    className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <Button 
                  variant="primary" 
                  className="flex-1 shadow-indigo-500/25"
                  disabled={!product.inStock}
                  onClick={() => handleAdd(product.id)}
                >
                  Add to Cart
                </Button>
              </div>
              <p className="text-[10px] text-center mt-2 text-gray-400 font-medium">
                Min. order: {product.minOrderQty} {product.unit}(s)
              </p>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
            No products available from this supplier yet.
          </div>
        )}
      </div>
    </div>
  );
}

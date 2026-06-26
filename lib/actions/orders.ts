"use server";

import { createClientServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CheckoutItem {
  product: {
    id: number;
    supplierId: number;
    price: number;
  };
  quantity: number;
}

export async function checkoutCart(items: CheckoutItem[]): Promise<{ success: boolean; message: string }> {
  const supabase = await createClientServer();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not authenticated" };
  }

  if (items.length === 0) {
    return { success: false, message: "Cart is empty" };
  }

  try {
    // Group items by supplierId
    const itemsBySupplier: Record<number, CheckoutItem[]> = {};
    for (const item of items) {
      const sId = item.product.supplierId;
      if (!itemsBySupplier[sId]) {
        itemsBySupplier[sId] = [];
      }
      itemsBySupplier[sId].push(item);
    }

    const createdOrderIds: number[] = [];

    // Create a purchase order for each supplier
    for (const [supplierIdStr, supplierItems] of Object.entries(itemsBySupplier)) {
      const supplierId = parseInt(supplierIdStr, 10);
      
      // Calculate total cost for this supplier
      const totalCost = supplierItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const expectedDeliveryDate = new Date();
      expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 3); // 3 days delivery default

      // Call the existing RPC function
      const rpcItems = supplierItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        cost_per_item: item.product.price,
      }));

      const { data: orderId, error: rpcError } = await supabase.rpc("create_new_purchase_order", {
        p_supplier_id: supplierId,
        p_status: "Pending",
        p_expected_delivery_date: expectedDeliveryDate.toISOString().split("T")[0],
        p_total_cost: totalCost,
        p_user_id: user.id,
        p_items: rpcItems,
      });

      if (rpcError) {
        console.error("RPC Error during checkout:", rpcError);
        throw new Error(rpcError.message);
      }

      if (orderId) {
        createdOrderIds.push(Number(orderId));
      }
    }

    revalidatePath("/orders");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Checkout successful! Placed ${createdOrderIds.length} order(s).`,
    };
  } catch (error: any) {
    console.error("Checkout error:", error);
    return {
      success: false,
      message: error.message || "Failed to process checkout",
    };
  }
}

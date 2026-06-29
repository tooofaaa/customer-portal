"use server";

import { createClientServer } from "@/lib/supabase/server";
import { WarehouseStorage } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getWarehouseStorage(): Promise<{ data: WarehouseStorage[]; error: string | null }> {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: [], error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("customer_profiles")
    .select("id")
    .eq("portal_user_id", user.id)
    .maybeSingle();

  if (!profile) return { data: [], error: "Profile not found" };

  const { data, error } = await supabase
    .from("customer_warehouse_storage")
    .select("*")
    .eq("customer_id", profile.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: data || [], error: null };
}

export async function requestWarehouseStorage(spaceM3: number, notes?: string): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  if (spaceM3 <= 0) return { success: false, error: "Space requested must be greater than 0" };

  const { data: profile } = await supabase
    .from("customer_profiles")
    .select("id")
    .eq("portal_user_id", user.id)
    .maybeSingle();

  if (!profile) return { success: false, error: "Profile not found" };

  const cost = spaceM3 * 15; // 15 SAR per m3 default cost

  const { error } = await supabase.from("customer_warehouse_storage").insert({
    customer_id: profile.id,
    space_m3: spaceM3,
    notes: notes,
    cost_per_period: cost,
    period: "Monthly",
    status: "Pending",
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/warehouse");

  return { success: true, error: null };
}

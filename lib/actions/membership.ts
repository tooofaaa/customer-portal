"use server";

import { createClientServer } from "@/lib/supabase/server";
import { CustomerMembership, MembershipLevel } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getCustomerMembership(): Promise<{ data: CustomerMembership | null; error: string | null }> {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Unauthorized" };

  // Fetch profile first
  const { data: profile } = await supabase
    .from("customers")
    .select("id")
    .eq("portal_user_id", user.id)
    .maybeSingle();

  if (!profile) return { data: null, error: "Profile not found" };

  // Fetch or create membership
  let { data: membership, error } = await supabase
    .from("customer_memberships")
    .select("*, level:membership_levels(*)")
    .eq("customer_id", profile.id)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  // Auto-provision Bronze if no membership exists
  if (!membership) {
    const { data: defaultLevel } = await supabase
      .from("membership_levels")
      .select("id")
      .eq("level_name", "Bronze")
      .single();

    if (defaultLevel) {
      const { data: newMembership, error: insertError } = await supabase
        .from("customer_memberships")
        .insert({
          customer_id: profile.id,
          level_id: defaultLevel.id,
          total_spent_sar: 0,
        })
        .select("*, level:membership_levels(*)")
        .single();

      if (insertError) {
        return { data: null, error: insertError.message };
      }
      membership = newMembership;
    }
  }

  return { data: membership as CustomerMembership, error: null };
}

export async function getMembershipLevels(): Promise<{ data: MembershipLevel[]; error: string | null }> {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("membership_levels")
    .select("*")
    .order("min_spent_sar", { ascending: true });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: data || [], error: null };
}

export async function recalculateMembershipTier(): Promise<{ success: boolean; newTier?: string; error: string | null }> {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("customers")
    .select("id")
    .eq("portal_user_id", user.id)
    .maybeSingle();

  if (!profile) return { success: false, error: "Profile not found" };

  // Calculate actual total spent from completed orders
  const { data: orders } = await supabase
    .from("orders")
    .select("total_cost")
    .eq("user_id", user.id)
    .eq("status", "Delivered");

  const totalSpent = (orders || []).reduce((sum, o) => sum + (Number(o.total_cost) || 0), 0);

  // Find correct tier
  const { data: tiers } = await supabase
    .from("membership_levels")
    .select("*")
    .order("min_spent_sar", { ascending: false });

  if (!tiers || tiers.length === 0) return { success: false, error: "No tiers defined" };

  let activeTier = tiers[tiers.length - 1]; // Fallback to lowest
  for (const tier of tiers) {
    if (totalSpent >= Number(tier.min_spent_sar)) {
      activeTier = tier;
      break;
    }
  }

  // Update membership
  const { error: updateError } = await supabase
    .from("customer_memberships")
    .update({
      level_id: activeTier.id,
      total_spent_sar: totalSpent,
      updated_at: new Date().toISOString(),
    })
    .eq("customer_id", profile.id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath("/membership");
  revalidatePath("/dashboard");

  return { success: true, newTier: activeTier.level_name, error: null };
}

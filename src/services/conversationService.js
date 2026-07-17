import { supabase } from "./supabase";

export async function getConversation(code) {
  const normalizedCode = (code || "").trim().toUpperCase();

  if (!normalizedCode) {
    return null;
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_code", normalizedCode)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (data) {
    return data;
  }

  const { data: fallbackData, error: fallbackError } = await supabase
    .from("messages")
    .select("*")
    .ilike("conversation_code", `%${normalizedCode}%`)
    .maybeSingle();

  if (fallbackError && fallbackError.code !== "PGRST116") {
    throw fallbackError;
  }

  return fallbackData;
}
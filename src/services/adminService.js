import { supabase } from "./supabase";

export async function getMessages() {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function replyToMessage(id, reply) {
  const { error } = await supabase
    .from("messages")
    .update({
      admin_reply: reply,
      status: "replied",
      replied_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}
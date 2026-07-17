import { supabase } from "./supabase";

function generateConversationCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "SS-";

  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}

export async function createMessage(message) {
  const conversationCode = generateConversationCode();

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        id: crypto.randomUUID(),
        text: message,
        conversation_code: conversationCode,
        created_at: new Date().toISOString(),
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}
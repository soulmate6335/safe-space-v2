import { supabase } from "./supabase";

function generateConversationCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "SS-";

  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}

export async function createConversation(firstMessage) {
  const conversationCode = generateConversationCode();

  // Create conversation
  const { data: conversation, error: conversationError } =
    await supabase
      .from("conversations")
      .insert([
        {
          conversation_code: conversationCode,
        },
      ])
      .select()
      .single();

  if (conversationError) throw conversationError;

  // Create first message
  const { error: messageError } = await supabase
    .from("conversation_messages")
    .insert([
      {
        conversation_id: conversation.id,
        sender: "user",
        message: firstMessage,
      },
    ]);

  if (messageError) throw messageError;

  return {
    conversationId: conversation.id,
    conversationCode,
  };
}

        export async function sendMessage(conversationId, sender, message) {
          const { data, error } = await supabase
            .from("conversation_messages")
            .insert([
              {
                conversation_id: conversationId,
                sender,
                message,
                is_read: false,
              },
            ])
            .select()
            .single();

          if (error) throw error;

          await supabase
            .from("conversations")
            .update({
              updated_at: new Date().toISOString(),
            })
            .eq("id", conversationId);

          return data;
        }

export async function getConversationByCode(code) {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("conversation_code", code)
    .single();

  if (error) throw error;

  return data;
}

export async function getConversationMessages(
  conversationId
) {
  const { data, error } = await supabase
    .from("conversation_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at");

  if (error) throw error;

  return data;
}

export async function updateConversationStatus(
  conversationId,
  status
) {
  const { error } = await supabase
    .from("conversations")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId);

  if (error) throw error;
}

export async function getConversation(conversationId) {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  if (error) throw error;

  return data;
}

export function subscribeToConversation(conversationId, callback) {
  const channel = supabase
    .channel(`conversation-${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "conversation_messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        console.log("🔥 REALTIME EVENT:", JSON.stringify(payload, null, 2));
        callback(payload);
      }
    );

  channel.subscribe((status) => {
    console.log("📡 Subscription:", status);
  });

  return {
    unsubscribe() {
      supabase.removeChannel(channel);
    },
  };
}
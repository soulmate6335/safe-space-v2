import { supabase } from "./supabase";

const TABLE = "typing_status";

export async function setTyping(
  conversationId,
  sender,
  isTyping
) {
  const { error } = await supabase
    .from(TABLE)
    .upsert(
      {
        conversation_id: conversationId,
        sender,
        is_typing: isTyping,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "conversation_id",
      }
    );

  if (error) throw error;
}

export function subscribeTyping(
  conversationId,
  callback
) {
  const channel = supabase
    .channel(`typing-${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: TABLE,
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    );

  channel.subscribe((status) => {
    console.log("Typing channel:", status);

    if (status === "CHANNEL_ERROR") {
      console.error("Typing realtime channel failed.");
    }
  });

  return {
    unsubscribe() {
      supabase.removeChannel(channel);
    },
  };
}
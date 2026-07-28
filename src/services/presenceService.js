import { supabase } from "./supabase";

const TABLE = "presence";

/**
 * Update the online status of a participant.
 */
export async function setOnline(conversationId, sender, isOnline) {
  const { error } = await supabase
    .from("presence")
    .upsert(
      {
        conversation_id: conversationId,
        sender,
        is_online: isOnline,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "conversation_id,sender",
      }
    );

  if (error) throw error;
}


/**
 * Listen for presence updates in a conversation.
 */
export function subscribePresence(
  conversationId,
  callback
) {
  const channel = supabase
    .channel(`presence-${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: TABLE,
        filter: `conversation_id=eq.${conversationId}`,
      },
      ({ new: record }) => {
        if (record) {
          callback(record);
        }
      }
    );

  channel.subscribe();

  return {
    unsubscribe() {
      supabase.removeChannel(channel);
    },
  };
}

/**
 * Get current online status.
 */
export async function getPresence(conversationId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("conversation_id", conversationId);

  if (error) throw error;

  return data ?? [];
}
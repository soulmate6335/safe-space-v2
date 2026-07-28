import { supabase } from "./supabase";

const CONVERSATIONS_TABLE = "conversations";
const MESSAGES_TABLE = "conversation_messages";

/* ============================================================
   GET ALL CONVERSATIONS
============================================================ */

export async function getConversations() {
  const { data: conversations, error: conversationsError } =
    await supabase
      .from(CONVERSATIONS_TABLE)
      .select("*")
      .order("updated_at", { ascending: false });

  if (conversationsError) throw conversationsError;

  if (!conversations || conversations.length === 0) {
    return [];
  }

  const ids = conversations.map((c) => c.id);

  const { data: messages, error: messagesError } =
    await supabase
      .from(MESSAGES_TABLE)
      .select("*")
      .in("conversation_id", ids)
      .order("created_at", { ascending: true });

  if (messagesError) throw messagesError;

  const lastMessage = new Map();
  const unread = new Map();

  for (const msg of messages || []) {
    lastMessage.set(msg.conversation_id, msg);

    if (msg.sender === "user" && !msg.is_read) {
      unread.set(
        msg.conversation_id,
        (unread.get(msg.conversation_id) || 0) + 1
      );
    }
  }

          return conversations
          .map((conversation) => ({
            ...conversation,
            last_message:
              lastMessage.get(conversation.id) || null,
            unread_count:
              unread.get(conversation.id) || 0,
          }))
          .sort((a, b) => {
            const aTime = new Date(
              a.last_message?.created_at || a.updated_at
            ).getTime();

            const bTime = new Date(
              b.last_message?.created_at || b.updated_at
            ).getTime();

            return bTime - aTime;
          });



}

/* ============================================================
   GET ONE CONVERSATION
============================================================ */

export async function getConversation(
  conversationId
) {
  const { data, error } = await supabase
    .from(CONVERSATIONS_TABLE)
    .select("*")
    .eq("id", conversationId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

/* ============================================================
   GET MESSAGES
============================================================ */

export async function getConversationMessages(
  conversationId
) {
  const { data, error } = await supabase
    .from(MESSAGES_TABLE)
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", {
      ascending: true,
    });

  if (error) throw error;

  return data || [];
}

/* ============================================================
   SEND ADMIN MESSAGE
============================================================ */

export async function replyToConversation(
  conversationId,
  message
) {
  const trimmed = message.trim();

  const { data, error } = await supabase
    .from(MESSAGES_TABLE)
    .insert({
      conversation_id: conversationId,
      sender: "admin",
      message: trimmed,
      is_read: true,
    })
    .select()
    .single();

  if (error) throw error;

  await supabase
    .from(CONVERSATIONS_TABLE)
    .update({
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId);

  return data;
}

/* ============================================================
   MARK READ
============================================================ */

export async function markConversationRead(
  conversationId
) {
  const { error } = await supabase
    .from(MESSAGES_TABLE)
    .update({
      is_read: true,
    })
    .eq("conversation_id", conversationId)
    .eq("sender", "user")
    .eq("is_read", false);

  if (error) throw error;
}

/* ============================================================
   CLOSE CONVERSATION
============================================================ */

export async function closeConversation(
  conversationId
) {
  const { error } = await supabase
    .from(CONVERSATIONS_TABLE)
    .update({
      status: "closed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId);

  if (error) throw error;
}

/* ============================================================
   REOPEN CONVERSATION
============================================================ */

export async function reopenConversation(
  conversationId
) {
  const { error } = await supabase
    .from(CONVERSATIONS_TABLE)
    .update({
      status: "open",
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId);

  if (error) throw error;
}

/* ============================================================
   ARCHIVE CONVERSATION
============================================================ */

export async function archiveConversation(
  conversationId
) {
  const { error } = await supabase
    .from(CONVERSATIONS_TABLE)
    .update({
      status: "archived",
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId);

  if (error) throw error;
}

/* ============================================================
   REALTIME INBOX
============================================================ */

export function subscribeToInbox(onChange) {
  const channel = supabase
    .channel("admin-inbox")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: MESSAGES_TABLE,
      },
      (payload) =>
        onChange({
          eventType: payload.eventType,
          new: payload.new,
          old: payload.old,
        })
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: CONVERSATIONS_TABLE,
      },
      (payload) =>
        onChange({
          eventType: payload.eventType,
          new: payload.new,
          old: payload.old,
        })
    )
    .subscribe();

  return {
    unsubscribe() {
      supabase.removeChannel(channel);
    },
  };
}

/* ============================================================
   REALTIME CONVERSATION
============================================================ */

export function subscribeToConversation(
  conversationId,
  onChange
) {
  const channel = supabase
    .channel(
      `admin-conversation-${conversationId}`
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: MESSAGES_TABLE,
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) =>
        onChange({
          new: payload.new,
          old: payload.old,
        })
    )
    .subscribe();

  return {
    unsubscribe() {
      supabase.removeChannel(channel);
    },
  };
}


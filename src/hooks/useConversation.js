import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  getConversation,
  getConversationByCode,
  getConversationMessages,
  sendMessage as sendMessageService,
  subscribeToConversation,
} from '../services/conversationService';
import { showNewMessageNotification } from '../services/notificationService';
import {
  setFaviconBadge,
  clearFaviconBadge,
} from "../services/faviconService";
import useUnreadTabIndicator from "./useUnreadTabIndicator";

/**
 * useConversation
 *
 * Loads a conversation (by id or by conversation_code), loads its messages,
 * keeps everything in sync in realtime, and exposes a sendMessage helper.
 *
 * @param {Object} params
 * @param {string} [params.conversationId] - Conversation UUID/id, if known.
 * @param {string} [params.conversationCode] - Conversation code (e.g. SS-4JK8LQ), used when id is not known.
 * @param {string} [params.sender] - Value written to conversation_messages.sender for outgoing messages (e.g. 'user' or 'admin').
 */
export default function useConversation({ conversationId, conversationCode, sender = 'user' } = {}) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  useUnreadTabIndicator(unreadCount);

  const subscriptionRef = useRef(null);
  const isMountedRef = useRef(true);
  const conversationIdRef = useRef(conversationId || null);
  const isTabActiveRef = useRef(!document.hidden && document.hasFocus());
  const conversationCodeRef = useRef(conversationCode || null);

  const safeSetState = useCallback((setter) => {
    if (isMountedRef.current) setter();
  }, []);

  // Merge a new/updated message into state without creating duplicates.
  // Also detects genuinely new messages from the other party and, if the
  // tab isn't currently active, bumps the unread count and fires a browser
  // notification.
  const upsertMessage = useCallback((incoming) => {
    safeSetState(() => {
      setMessages((prev) => {
        const alreadyExists = prev.some((m) => m.id === incoming.id);

        if (!alreadyExists && incoming.sender !== sender && !isTabActiveRef.current) {
          setUnreadCount((count) => count + 1);
          showNewMessageNotification({
            conversationCode: conversationCodeRef.current,
            message: incoming.message,
            onClick: () => {
              setUnreadCount(0);
            },
          });
        }

        if (alreadyExists) {
          return prev.map((m) => (m.id === incoming.id ? incoming : m));
        }
        return [...prev, incoming].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
      });
    });
  }, [safeSetState, sender]);

  const teardownSubscription = useCallback(() => {
    if (subscriptionRef.current) {
      try {
        if (typeof subscriptionRef.current.unsubscribe === 'function') {
          subscriptionRef.current.unsubscribe();
        } else if (typeof subscriptionRef.current === 'function') {
          subscriptionRef.current();
        }
      } catch {
        // Non-fatal: subscription may already be closed.
      }
      subscriptionRef.current = null;
    }
  }, []);

  const attachSubscription = useCallback((id) => {
    teardownSubscription();
    subscriptionRef.current = subscribeToConversation(id, (payload) => {
      // Support either a raw message row or a { new: row } realtime payload shape.
      const row = payload?.new ?? payload;
      if (!row) return;
      upsertMessage(row);
    });
  }, [teardownSubscription, upsertMessage]);

  const loadAll = useCallback(async () => {
    safeSetState(() => {
      setLoading(true);
      setError(null);
    });

    try {
      let convo = null;

      if (conversationId) {
        convo = await getConversation(conversationId);
      } else if (conversationCode) {
        convo = await getConversationByCode(conversationCode);
      } else {
        throw new Error('No conversation reference provided.');
      }

      if (!convo) {
        throw new Error('Conversation not found.');
      }

      conversationIdRef.current = convo.id;
      conversationCodeRef.current = convo.conversation_code || conversationCodeRef.current;

      const msgs = await getConversationMessages(convo.id);

      safeSetState(() => {
        setConversation(convo);
        setMessages(
          (msgs || []).slice().sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        );
      });

      attachSubscription(convo.id);
    } catch (err) {
      safeSetState(() => {
        setError(err.message || 'Something went wrong loading this conversation.');
      });
    } finally {
      safeSetState(() => setLoading(false));
    }
  }, [conversationId, conversationCode, attachSubscription, safeSetState]);

  const refresh = useCallback(async () => {
    if (!conversationIdRef.current) return;
    try {
      const msgs = await getConversationMessages(conversationIdRef.current);
      safeSetState(() => {
        setMessages(
          (msgs || []).slice().sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        );
      });
    } catch {
      // Silent refresh failure — realtime subscription is the primary source of truth.
    }
  }, [safeSetState]);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || '').trim();
      if (!trimmed || !conversationIdRef.current) return null;

      setSending(true);

      // Optimistic message so the UI feels instant.
      const optimisticId = `optimistic-${Date.now()}`;
      const optimisticMessage = {
        id: optimisticId,
        conversation_id: conversationIdRef.current,
        sender,
        message: trimmed,
        is_read: false,
        created_at: new Date().toISOString(),
        _optimistic: true,
      };

      safeSetState(() => setMessages((prev) => [...prev, optimisticMessage]));

      try {
        const saved = await sendMessageService(conversationIdRef.current, sender, trimmed);

        safeSetState(() => {
          setMessages((prev) => {
            const withoutOptimistic = prev.filter((m) => m.id !== optimisticId);
            const finalMessage = saved || { ...optimisticMessage, _optimistic: false };
            const exists = withoutOptimistic.some((m) => m.id === finalMessage.id);
            const next = exists
              ? withoutOptimistic.map((m) => (m.id === finalMessage.id ? finalMessage : m))
              : [...withoutOptimistic, finalMessage];
            return next.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          });
        });

        return saved;
      } catch {
        safeSetState(() => {
          setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
        });
        toast.error('Message failed to send. Please try again.');
        return null;
      } finally {
        safeSetState(() => setSending(false));
      }
    },
    [sender, safeSetState]
  );

  const resetUnread = useCallback(() => {
    safeSetState(() => setUnreadCount(0));
  }, [safeSetState]);

  useEffect(() => {
    const handleActive = () => {
      isTabActiveRef.current = true;
      resetUnread();
    };
    const handleInactive = () => {
      isTabActiveRef.current = false;
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleInactive();
      } else {
        handleActive();
      }
    };

    window.addEventListener('focus', handleActive);
    window.addEventListener('blur', handleInactive);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleActive);
      window.removeEventListener('blur', handleInactive);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [resetUnread]);

  useEffect(() => {
  if (unreadCount > 0) {
    setFaviconBadge(unreadCount);
  } else {
    clearFaviconBadge();
  }
}, [unreadCount]);

  useEffect(() => {
    isMountedRef.current = true;
    loadAll();

    return () => {
      isMountedRef.current = false;
      teardownSubscription();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, conversationCode]);

  return {
    conversation,
    messages,
    loading,
    sending,
    error,
    unreadCount,
    resetUnread,
    sendMessage,
    refresh,
  };
}
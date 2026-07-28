import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getConversation,
  getConversationMessages,
  replyToConversation,
  markConversationRead,
  subscribeToConversation,
  closeConversation,
  reopenConversation,
} from "../services/adminConversationService";

import { setTyping } from "../services/typingService";
import { setOnline } from "../services/presenceService";

import AdminChatWindow from "../components/admin/AdminChatWindow";
import AdminMessageInput from "../components/admin/AdminMessageInput";

const STATUS_STYLES = {
  open:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  closed:
    "bg-gray-200 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400",
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
};

export default function AdminConversation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [note, setNote] = useState("");


  const subscriptionRef = useRef(null);
  const isMountedRef = useRef(true);

  const safeSet = useCallback((setter) => {
    if (isMountedRef.current) setter();
  }, []);

  const upsertMessage = useCallback(
    (incoming) => {
      safeSet(() => {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === incoming.id);

          const next = exists
            ? prev.map((m) => (m.id === incoming.id ? incoming : m))
            : [...prev, incoming];

          return next.sort(
            (a, b) =>
              new Date(a.created_at) - new Date(b.created_at)
          );
        });
      });
    },
    [safeSet]
  );

  const loadConversation = useCallback(async () => {
    if (!id) return;


    
    safeSet(() => {
      setLoading(true);
      setError(null);
    });

    try {
      const [convo, msgs] = await Promise.all([
        getConversation(id),
        getConversationMessages(id),
      ]);

      if (!convo) {
        throw new Error("Conversation not found.");
      }

      safeSet(() => {
      setConversation(convo);
setNote(convo.founder_note ?? "");
        setMessages(
          (msgs || []).slice().sort(
            (a, b) =>
              new Date(a.created_at) - new Date(b.created_at)
          )
        );
      });

      await markConversationRead(id);
    } catch (err) {
      safeSet(() =>
        setError(err.message || "Failed to load this conversation.")
      );
    } finally {
      safeSet(() => setLoading(false));
    }
  }, [id, safeSet, setNote]);

  useEffect(() => {
  if (!id) return;

  isMountedRef.current = true;

  loadConversation();

  setOnline(id, "admin", true).catch(console.error);

  subscriptionRef.current = subscribeToConversation(
    id,
    (payload) => {
      const row = payload?.new ?? payload;

      if (!row) return;

      upsertMessage(row);

      if (row.sender === "user" && !row.is_read) {
        markConversationRead(id).catch(() => {});
      }
    }
  );

  return () => {
    isMountedRef.current = false;

    subscriptionRef.current?.unsubscribe?.();

    setTyping(id, "admin", false).catch(() => {});
    setOnline(id, "admin", false).catch(console.error);
  };
}, [id, loadConversation, upsertMessage]);

  const handleSend = async (text) => {
    const trimmed = (text || "").trim();

    if (!trimmed || !id) return;

    setSending(true);

    const optimisticId = `optimistic-${Date.now()}`;

    const optimisticMessage = {
      id: optimisticId,
      conversation_id: id,
      sender: "admin",
      message: trimmed,
      is_read: true,
      created_at: new Date().toISOString(),
      _optimistic: true,
    };

    safeSet(() =>
      setMessages((prev) => [...prev, optimisticMessage])
    );

    try {
      const saved = await replyToConversation(id, trimmed);

      await setTyping(id, "admin", false);

      safeSet(() => {
        setMessages((prev) => {
          const withoutOptimistic = prev.filter(
            (m) => m.id !== optimisticId
          );

          const finalMessage =
            saved || {
              ...optimisticMessage,
              _optimistic: false,
            };

          const exists = withoutOptimistic.some(
            (m) => m.id === finalMessage.id
          );

          const next = exists
            ? withoutOptimistic.map((m) =>
                m.id === finalMessage.id ? finalMessage : m
              )
            : [...withoutOptimistic, finalMessage];

          return next.sort(
            (a, b) =>
              new Date(a.created_at) -
              new Date(b.created_at)
          );
        });
      });
    } catch {
      safeSet(() =>
        setMessages((prev) =>
          prev.filter((m) => m.id !== optimisticId)
        )
      );

      toast.error("Reply failed to send. Please try again.");
    } finally {
      safeSet(() => setSending(false));
    }
  };


  const handleCloseConversation = async () => {
  if (!conversation) return;

  try {
    setChangingStatus(true);

    await closeConversation(conversation.id);

    setConversation((prev) => ({
      ...prev,
      status: "closed",
    }));

    toast.success("Conversation closed.");
  } catch (err) {
    console.error(err);
    toast.error("Failed to close conversation.");
  } finally {
    setChangingStatus(false);
  }
};


        const handleReopenConversation = async () => {
          if (!conversation) return;

          try {
            setChangingStatus(true);

            await reopenConversation(conversation.id);

            setConversation((prev) => ({
              ...prev,
              status: "open",
            }));

            toast.success("Conversation reopened.");
          } catch (err) {
            console.error(err);
            toast.error("Failed to reopen conversation.");
          } finally {
            setChangingStatus(false);
          }
        };


  if (loading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-200 border-t-purple-600" />
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Loading conversation…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center dark:bg-gray-950">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {error}
        </p>

        <button
          onClick={() => navigate("/admin")}
          className="rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
        >
          Back to inbox
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-full flex-col bg-gray-50 dark:bg-gray-950">
      <header className="flex items-center gap-3 border-b border-gray-200 bg-white/80 px-4 py-4 backdrop-blur sm:px-6 dark:border-gray-800 dark:bg-gray-900/80">
        <button
          onClick={() => navigate("/admin")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
          {(conversation?.conversation_code || "??")
            .slice(-2)
            .toUpperCase()}
        </div>

                <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="truncate font-mono text-base font-semibold text-gray-900 dark:text-gray-100">
                {conversation?.conversation_code}
              </h1>

              <span
                className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
                  STATUS_STYLES[conversation?.status] ||
                  STATUS_STYLES.open
                }`}
              >
                {conversation?.status || "open"}
              </span>
            </div>

            <button
              onClick={
                conversation?.status === "closed"
                  ? handleReopenConversation
                  : handleCloseConversation
              }
              disabled={changingStatus}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700 disabled:opacity-60"
            >
              {changingStatus
                ? "Updating..."
                : conversation?.status === "closed"
                ? "Reopen"
                : "Close"}
            </button>
          </div>
        </div>
      </header>

      <AdminChatWindow messages={messages} />

      <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
        <AdminMessageInput
          onSend={handleSend}
          disabled={sending}
          onTyping={(typing) =>
            setTyping(id, "admin", typing)
          }
        />
      </div>
    </div>
  );
}
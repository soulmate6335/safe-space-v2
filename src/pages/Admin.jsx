import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getConversations,
  subscribeToInbox,
} from "../services/adminConversationService";

import AdminConversationList from "../components/admin/AdminConversationList";

export default function Admin() {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const subscriptionRef = useRef(null);
  const isMountedRef = useRef(true);

  const loadConversations = useCallback(async ({ silent = false } = {}) => {
    try {
      const data = await getConversations();

              if (isMountedRef.current) {
          setConversations(data);
          setError(null);
        }
              } catch (err) {
                if (isMountedRef.current) {
            setError(err.message || "Failed to load conversations.");
          }

      if (!silent) {
        toast.error("Failed to load conversations.");
      }
    } finally {
                    if (isMountedRef.current) {
                setLoading(false);
              }
    }
  }, []);

  useEffect(() => {
  isMountedRef.current = true;

  loadConversations();

  subscriptionRef.current = subscribeToInbox(() => {
    loadConversations({ silent: true });
  });

  return () => {
    isMountedRef.current = false;
    subscriptionRef.current?.unsubscribe?.();
  };
}, [loadConversations]);

  const stats = useMemo(() => {
    const unread = conversations.filter(
      (c) => (c.unread_count || 0) > 0
    ).length;

    const pending = conversations.filter(
      (c) => c.status === "pending"
    ).length;

    const open = conversations.filter(
      (c) => c.status === "open"
    ).length;

    return {
      total: conversations.length,
      unread,
      pending,
      open,
    };
  }, [conversations]);


  const filteredConversations = useMemo(() => {
  switch (filter) {
    case "unread":
      return conversations.filter((c) => (c.unread_count || 0) > 0);

    case "pending":
      return conversations.filter((c) => c.status === "pending");

    case "open":
      return conversations.filter((c) => c.status === "open");

    default:
      return conversations;
  }
}, [conversations, filter]);


  const handleSelectConversation = (conversationId) => {
    navigate(`/admin/conversation/${conversationId}`);
  };

  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Safe Space Admin
            </h1>

            <p className="mt-1 text-gray-500">
              Monitor and respond to anonymous conversations.
            </p>
          </div>

          <div className="rounded-full bg-purple-600 px-5 py-3 font-bold text-white">
            {stats.total}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
       <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

  <button
    onClick={() => setFilter("all")}
    className={`rounded-3xl p-5 text-left shadow transition-all ${
      filter === "all"
        ? "bg-purple-600 text-white"
        : "bg-white dark:bg-gray-900"
    }`}
  >
    <p className={filter === "all" ? "text-purple-100" : "text-gray-500"}>
      Total Conversations
    </p>

    <h2 className="mt-2 text-3xl font-bold">
      {stats.total}
    </h2>
  </button>

  <button
    onClick={() => setFilter("unread")}
    className={`rounded-3xl p-5 text-left shadow transition-all ${
      filter === "unread"
        ? "bg-red-600 text-white"
        : "bg-white dark:bg-gray-900"
    }`}
  >
    <p className={filter === "unread" ? "text-red-100" : "text-gray-500"}>
      Unread
    </p>

    <h2 className="mt-2 text-3xl font-bold">
      {stats.unread}
    </h2>
  </button>

  <button
    onClick={() => setFilter("pending")}
    className={`rounded-3xl p-5 text-left shadow transition-all ${
      filter === "pending"
        ? "bg-yellow-500 text-white"
        : "bg-white dark:bg-gray-900"
    }`}
  >
    <p className={filter === "pending" ? "text-yellow-100" : "text-gray-500"}>
      Pending
    </p>

    <h2 className="mt-2 text-3xl font-bold">
      {stats.pending}
    </h2>
  </button>

  <button
    onClick={() => setFilter("open")}
    className={`rounded-3xl p-5 text-left shadow transition-all ${
      filter === "open"
        ? "bg-green-600 text-white"
        : "bg-white dark:bg-gray-900"
    }`}
  >
    <p className={filter === "open" ? "text-green-100" : "text-gray-500"}>
      Open
    </p>

    <h2 className="mt-2 text-3xl font-bold">
      {stats.open}
    </h2>
  </button>

</div>

        <div className="flex-1 overflow-hidden">
          <AdminConversationList
            conversations={filteredConversations}
            loading={loading}
            error={error}
            onSelectConversation={handleSelectConversation}
          />
        </div>
      </main>
    </div>
  );
}
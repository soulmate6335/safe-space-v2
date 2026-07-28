import { useMemo, useState } from "react";

const STATUS_STYLES = {
  open:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  closed:
    "bg-gray-200 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400",
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
};

function statusStyle(status) {
  return STATUS_STYLES[status] || STATUS_STYLES.open;
}

function timeAgo(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  const seconds = Math.floor(
    (Date.now() - date.getTime()) / 1000
  );

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);

  if (days === 1) return "Yesterday";

  if (days < 7) return `${days}d`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse items-center gap-3 rounded-2xl bg-gray-100 p-3 dark:bg-gray-800/60"
        >
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />

          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminConversationList({
  conversations = [],
  loading = false,
  error = null,
  onSelectConversation,
  selectedConversationId = null,
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return conversations;

    return conversations.filter((conversation) => {
      const code =
        conversation.conversation_code?.toLowerCase() || "";

      const preview = conversation.last_message
  ? `${
      conversation.last_message.sender === "admin" ? "You: " : ""
    }${conversation.last_message.message.slice(0, 80)}`
  : "No messages yet";

      const status =
        conversation.status?.toLowerCase() || "";

      return (
        code.includes(query) ||
        preview.includes(query) ||
        status.includes(query)
      );
    });
  }, [conversations, search]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-200 p-3 dark:border-gray-800">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
            />
          </svg>

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search code, message or status..."
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <ListSkeleton />
        ) : error ? (
          <div className="flex h-full items-center justify-center p-8 text-center">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-full items-center justify-center p-8 text-gray-400">
            {search
              ? "No conversations found."
              : "No conversations yet."}
          </div>
        ) : (
          <ul className="space-y-1 p-2">
            {filtered.map((conversation) => {
              const hasUnread =
                (conversation.unread_count || 0) > 0;

              const isSelected =
                conversation.id ===
                selectedConversationId;

              const preview = conversation.last_message
                ? `${
                    conversation.last_message.sender ===
                    "admin"
                      ? "You: "
                      : ""
                  }${conversation.last_message.message}`
                : "No messages yet";

              return (
                <li key={conversation.id}>
                  <button
                    onClick={() =>
                      onSelectConversation?.(
                        conversation.id
                      )
                    }
                    className={`flex w-full items-center gap-3 rounded-2xl p-3 transition ${
                      isSelected
                        ? "bg-purple-50 ring-1 ring-purple-200 dark:bg-purple-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full font-semibold ${
                        hasUnread
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      {(
                        conversation.conversation_code ||
                        "??"
                      )
                        .slice(-2)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between">
                        <span className="truncate font-mono font-semibold">
                          {
                            conversation.conversation_code
                          }
                        </span>

                        <span className="text-xs text-gray-400">
                          {timeAgo(
                            conversation.last_message
                              ?.created_at ||
                              conversation.updated_at
                          )}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                          {preview}
                        </p>

                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] ${statusStyle(
                              conversation.status
                            )}`}
                          >
                            {conversation.status}
                          </span>

                                                        {hasUnread && (
                                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-2 text-xs font-bold text-white animate-pulse">
                                  {conversation.unread_count > 99
                                    ? "99+"
                                    : conversation.unread_count}
                                </span>
                              )}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
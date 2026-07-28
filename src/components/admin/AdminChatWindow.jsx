import { useEffect, useRef } from 'react';

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDateDivider(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
}

function groupByDay(messages) {
  const groups = [];
  let currentKey = null;
  let currentGroup = null;

  for (const message of messages) {
    const date = new Date(message.created_at);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    if (key !== currentKey) {
      currentKey = key;
      currentGroup = { key, label: formatDateDivider(message.created_at), messages: [] };
      groups.push(currentGroup);
    }

    currentGroup.messages.push(message);
  }

  return groups;
}

function MessageBubble({ message }) {
  const isAdmin = message.sender === 'admin';

  return (
    <div className={`flex w-full ${isAdmin ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex max-w-[78%] flex-col gap-1 rounded-2xl px-4 py-2.5 shadow-sm sm:max-w-[65%] ${
          isAdmin
            ? 'rounded-br-md bg-purple-600 text-white'
            : 'rounded-bl-md bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100'
        } ${message._optimistic ? 'opacity-70' : ''}`}
      >
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {message.message}
        </p>
        <span
          className={`self-end text-[10px] ${
            isAdmin ? 'text-purple-100/80' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          {formatTime(message.created_at)}
        </span>
      </div>
    </div>
  );
}

/**
 * AdminChatWindow
 *
 * Scrollable message history with admin messages right-aligned (purple) and
 * user messages left-aligned (neutral), grouped into day sections, and
 * auto-scrolled to the newest message whenever the list changes.
 *
 * @param {Object} props
 * @param {Array} props.messages
 */
export default function AdminChatWindow({ messages = [] }) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  const groups = groupByDay(messages);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto scroll-smooth bg-gray-50 px-3 py-4 dark:bg-gray-950 sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-1 py-16 text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              No messages yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Replies you send will appear here instantly.
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.key} className="flex flex-col gap-2">
              <div className="sticky top-0 z-10 flex justify-center py-1">
                <span className="rounded-full bg-gray-200/80 px-3 py-1 text-[11px] font-medium text-gray-500 backdrop-blur dark:bg-gray-800/80 dark:text-gray-400">
                  {group.label}
                </span>
              </div>

              {group.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          ))
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
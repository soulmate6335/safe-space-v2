function ChatBubble({
  sender,
  currentSender = "user",
  message,
  time,
  isRead = false,
}) {
  const isMine = sender === currentSender;

  return (
    <div
      className={`mb-5 flex w-full ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`relative max-w-[88%] rounded-3xl px-5 py-4 shadow-md transition-all duration-300 sm:max-w-[75%] ${
          isMine
            ? "rounded-br-lg bg-gradient-to-br from-violet-600 to-purple-700 text-white"
            : "rounded-bl-lg border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        }`}
      >
        {/* Message */}

        <p className="whitespace-pre-wrap break-words text-[15px] leading-7">
          {message}
        </p>

        {/* Footer */}

        <div
          className={`mt-4 flex items-center justify-end gap-2 text-[11px] ${
            isMine
              ? "text-violet-100"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          <span>{time}</span>

          {isMine && (
            <span
              className={`font-semibold tracking-tight ${
                isRead ? "text-emerald-300" : "text-violet-200"
              }`}
            >
              {isRead ? "✓✓" : "✓"}
            </span>
          )}
        </div>

        {/* Decorative glow */}

        {isMine && (
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-white/5" />
        )}
      </div>
    </div>
  );
}

export default ChatBubble;
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
      className={`flex mb-4 ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-3xl px-5 py-4 shadow-sm ${
          isMine
            ? "bg-violet-600 text-white rounded-br-md"
            : "bg-white border border-gray-200 text-gray-800 rounded-bl-md dark:bg-slate-800 dark:border-slate-700 dark:text-white"
        }`}
      >
        <p className="whitespace-pre-wrap break-words leading-7">
          {message}
        </p>

        <div
          className={`mt-3 flex items-center justify-end gap-1 text-xs ${
            isMine
              ? "text-violet-100"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          <span>{time}</span>

          {isMine && (
            <span className="font-semibold">
              {isRead ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatBubble;
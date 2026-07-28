import ChatBubble from "./ChatBubble";

function ChatMessages({ messages = [], currentSender = "user" }) {
  if (!messages.length) {
    return (
      <div className="flex justify-center py-20">
        <div className="rounded-2xl bg-gray-100 px-6 py-4 text-gray-500 dark:bg-slate-800 dark:text-slate-400">
          No messages yet.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages
        .filter((m) => m && typeof m.message === "string")
        .map((msg) => (
                      <ChatBubble
              key={msg.id}
              sender={msg.sender}
              currentSender={currentSender}
              message={msg.message}
              isRead={msg.is_read}
              time={new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
        ))}
    </div>
  );
}

export default ChatMessages;
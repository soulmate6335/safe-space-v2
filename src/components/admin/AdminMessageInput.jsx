import { useState, useRef, useCallback } from "react";

const MAX_TEXTAREA_HEIGHT = 160;

export default function AdminMessageInput({
  onSend,
  disabled = false,
  placeholder = "Reply...",
  onTyping,
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;

    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${Math.min(
      el.scrollHeight,
      MAX_TEXTAREA_HEIGHT
    )}px`;
  }, []);

  const handleChange = (e) => {
    const text = e.target.value;

    setValue(text);

    resizeTextarea();

    onTyping?.(text.trim().length > 0);
  };

  const submit = async () => {
    const trimmed = value.trim();

    if (!trimmed || disabled) return;

    try {
      await onSend?.(trimmed);

      setValue("");

      onTyping?.(false);

      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 dark:border-gray-700 dark:bg-gray-800 dark:focus-within:ring-purple-500/20">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="max-h-40 w-full resize-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={!canSend}
        aria-label="Send message"
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
          canSend
            ? "bg-purple-600 text-white hover:bg-purple-700"
            : "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
        }`}
      >
        {disabled ? (
          <svg
            className="h-5 w-5 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"
            />
            <path
              fill="currentColor"
              className="opacity-75"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 19V5m0 0l-6 6m6-6l6 6"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
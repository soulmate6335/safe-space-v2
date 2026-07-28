import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import useConversation from '../hooks/useConversation';
import useUnreadTabIndicator from '../hooks/useUnreadTabIndicator';

import ChatHeader from '../components/chat/ChatHeader';
import ChatMessages from '../components/chat/ChatMessages';
import ChatInput from '../components/chat/ChatInput';
import TypingIndicator from '../components/chat/TypingIndicator';
import NotificationPermissionBanner from '../components/chat/NotificationPermissionBanner';

import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';

import {
  getPresence,
  subscribePresence,
  setOnline,
} from "../services/presenceService";

// How close to the bottom (in pixels) counts as "already at the bottom" for
// deciding whether to auto-scroll vs. show the "new messages" pill.
const NEAR_BOTTOM_THRESHOLD = 120;

export default function Conversation() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  // Accept the conversation reference from router state (preferred, since it's
  // how the app already navigates here after creating a conversation), and
  // fall back to a route param / query string so a direct link or refresh
  // still works.
  const stateConversationId = location.state?.conversationId;
  const stateConversationCode = location.state?.conversationCode;
  const paramCode = params.code;

  const conversationId = stateConversationId || null;
  const conversationCode = stateConversationCode || paramCode || null;

  const {
    conversation,
    messages,
    loading,
    sending,
    error,
    unreadCount,
    resetUnread,
    sendMessage,
  } = useConversation({
    conversationId,
    conversationCode,
    sender: 'user',
  });

  // Reflects unreadCount (only bumped while the tab is hidden/unfocused)
  // into the browser tab title and favicon.
  useUnreadTabIndicator(unreadCount);

  // eslint-disable-next-line no-unused-vars -- reserved for a future presence/typing broadcast channel
  const [isPeerTyping, setIsPeerTyping] = useState(false);
const [founderPresence, setFounderPresence] = useState(null);

  // In-app "new messages" pill: separate from unreadCount above. This
  // covers the case where the tab IS focused but the user has scrolled up
  // to read earlier messages when a new one arrives.
  const [newMessagePillCount, setNewMessagePillCount] = useState(0);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const scrollContainerRef = useRef(null);
  const bottomAnchorRef = useRef(null);
  const previousMessageCountRef = useRef(messages.length);

  // Redirect home if we truly have nothing to load a conversation from.
  useEffect(() => {
    if (!conversationId && !conversationCode) {
      toast.error('No conversation found. Please start a new one.');
      navigate('/', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


useEffect(() => {
  if (!conversation?.id) return;

  let mounted = true;

  // Mark the user as online
  setOnline(conversation.id, "user", true).catch(console.error);

  async function loadPresence() {
    try {
      const rows = await getPresence(conversation.id);

      if (!mounted) return;

      const founder = rows.find(
  (r) => r.sender === "admin"
);

setFounderPresence(founder || null);
    } catch (err) {
      console.error(err);
    }
  }

  loadPresence();

  const subscription = subscribePresence(
    conversation.id,
    (presence) => {
      if (presence.sender === "admin") {
  setFounderPresence(presence);
}
    }
  );

  return () => {
    mounted = false;

    // Mark the user as offline
    setOnline(conversation.id, "user", false).catch(console.error);

    subscription.unsubscribe();
  };
}, [conversation]);


  const scrollToBottom = useCallback((behavior = 'smooth') => {
    bottomAnchorRef.current?.scrollIntoView({ behavior, block: 'end' });
  }, []);

  const checkNearBottom = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return true;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distanceFromBottom <= NEAR_BOTTOM_THRESHOLD;
  }, []);

  // Track scroll position so we know whether to auto-scroll on new messages
  // or show the "new messages" pill instead, and clear the pill once the
  // user scrolls back down themselves.
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return undefined;

    const handleScroll = () => {
      const nearBottom = checkNearBottom();
      setIsNearBottom(nearBottom);
      if (nearBottom) {
        setNewMessagePillCount(0);
      }
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [checkNearBottom]);

  // Whenever the message list grows: auto-scroll if the user was already
  // near the bottom (or this is the initial load), otherwise leave their
  // scroll position alone and surface the "new messages" pill instead.
  useEffect(() => {
    const previousCount = previousMessageCountRef.current;
    const grew = messages.length > previousCount;
    previousMessageCountRef.current = messages.length;

    if (!grew) return;

    if (isNearBottom) {
      scrollToBottom();
    } else {
      setNewMessagePillCount((count) => count + (messages.length - previousCount));
    }
  }, [messages.length, isNearBottom, scrollToBottom]);

  const handlePillClick = () => {
    setNewMessagePillCount(0);
    scrollToBottom();
    resetUnread();
  };

  // Lightweight "peer is typing" flourish: whenever a new admin message lands,
  // there's nothing to show, but this is where a future typing-channel event
  // would toggle isPeerTyping. Left wired up so ChatInput's onTyping can drive it.
  const handleLocalTyping = () => {
    // Placeholder hook point for a future presence/typing broadcast channel.
  };

  const handleSend = async (text) => {
    if (!text || !text.trim()) return;
    await sendMessage(text);
  };

  if (!conversationId && !conversationCode) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader label="Loading your conversation…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        <EmptyState
          title="We couldn't load this conversation"
          description={error}
          actionLabel="Back to home"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-full flex-col bg-gray-50 dark:bg-gray-950">
              <ChatHeader
  conversationCode={conversation?.conversation_code || conversationCode}
  status={conversation?.status}
  founderOnline={founderPresence?.is_online ?? false}
  founderLastSeen={founderPresence?.updated_at}
  onBack={() => navigate("/")}
/>

      <div className="border-b border-gray-100 px-3 pt-3 sm:px-6 dark:border-gray-900">
        <NotificationPermissionBanner />
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="h-full overflow-y-auto scroll-smooth px-3 py-4 sm:px-6"
        >
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
            {messages.length === 0 ? (
              <EmptyState
                title="No messages yet"
                description="Send the first message below whenever you're ready. This space is anonymous and just for you."
              />
            ) : (
              <ChatMessages messages={messages} currentSender="user" />
            )}

            {isPeerTyping && (
              <div className="mt-1">
                <TypingIndicator />
              </div>
            )}

            <div ref={bottomAnchorRef} />
          </div>
        </div>

        {newMessagePillCount > 0 && (
          <button
            onClick={handlePillClick}
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-purple-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            {newMessagePillCount === 1 ? 'New message' : `${newMessagePillCount} new messages`}
          </button>
        )}
      </div>

      <div className="border-t border-gray-200 bg-white/80 px-3 py-3 backdrop-blur sm:px-6 dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto w-full max-w-2xl">
          <ChatInput
            onSend={handleSend}
            onTyping={handleLocalTyping}
            disabled={sending}
            placeholder="Type a message…"
          />
        </div>
      </div>
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Layout from "../components/Layout";
import ReplyModal from "../components/ReplyModal";

import StatCard from "../components/ui/StatCard";
import SearchBar from "../components/ui/SearchBar";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

import { supabase } from "../services/supabase";
import {
  getMessages,
  replyToMessage,
} from "../services/adminService";
import { logout } from "../services/authService";

function Admin() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadMessages() {
    try {
      setLoading(true);

      const data = await getMessages();

      setMessages(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load messages.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReply(reply) {
    if (!selectedMessage) return;

    try {
      await replyToMessage(selectedMessage.id, reply);

      toast.success("Reply sent successfully!");

      setSelectedMessage(null);

      await loadMessages();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      toast.success("Logged out successfully.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Logout failed. Please try again.");
    } finally {
      navigate("/login", { replace: true });
    }
  }

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        message.text.toLowerCase().includes(keyword) ||
        (message.conversation_code || "")
          .toLowerCase()
          .includes(keyword);

      if (filter === "pending") {
        return matchesSearch && !message.admin_reply;
      }

      if (filter === "replied") {
        return matchesSearch && !!message.admin_reply;
      }

      return matchesSearch;
    });
  }, [messages, search, filter]);

  const stats = useMemo(() => {
    const pending = messages.filter(
      (m) => !m.admin_reply
    ).length;

    const replied = messages.filter(
      (m) => !!m.admin_reply
    ).length;

    return {
      total: messages.length,
      pending,
      replied,
    };
  }, [messages]);

  return (
  <Layout>
    <div className="mx-auto max-w-7xl">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-50 to-white p-4 shadow-sm sm:p-6 md:flex-row md:items-center md:justify-between dark:border-slate-700 dark:from-slate-900 dark:to-slate-900">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🌸 Safe Space Admin
          </h1>

          <p className="mt-2 text-gray-500 dark:text-slate-400">
            Manage anonymous conversations and provide compassionate replies.
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <Button
            variant="danger"
            className="sm:w-auto"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3 sm:gap-6">
        <StatCard
          title="Messages"
          value={stats.total}
          color="violet"
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          color="amber"
        />

        <StatCard
          title="Replied"
          value={stats.replied}
          color="green"
        />
      </div>

      {/* Search */}
      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-3">

        {["all", "pending", "replied"].map((item) => (

          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`
              rounded-full
              px-5
              py-2
              text-sm
              font-semibold
              transition

              ${
                filter === item
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            {item.charAt(0).toUpperCase() +
              item.slice(1)}
          </button>

        ))}

      </div>

      {/* Messages */}

      {loading ? (

        <div className="rounded-2xl bg-white p-12 text-center shadow">
          <p className="text-gray-500">
            Loading messages...
          </p>
        </div>

      ) : filteredMessages.length === 0 ? (

        <div className="rounded-2xl bg-white p-12 text-center shadow">
          <p className="text-gray-500">
            No conversations found.
          </p>
        </div>

      ) : (

        <div className="space-y-5">

          {filteredMessages.map((message) => (

            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className="
                cursor-pointer
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-6
                shadow-sm
                transition-all
                hover:-translate-y-1
                hover:shadow-lg
              "
            >

              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                <Badge
                  status={
                    message.admin_reply
                      ? "replied"
                      : "pending"
                  }
                />

                <span className="text-sm text-gray-500">
                  {new Date(
                    message.created_at
                  ).toLocaleString()}
                </span>

              </div>

              <div className="mb-4">

                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-violet-600">
                  Conversation Code
                </p>

                <p className="font-mono font-semibold text-violet-700">
                  {message.conversation_code}
                </p>

              </div>

              <p className="line-clamp-4 leading-7 text-gray-700">
                {message.text}
              </p>

              {message.admin_reply && (

                <div className="mt-5 rounded-xl bg-emerald-50 p-4">

                  <p className="mb-2 text-sm font-semibold text-emerald-700">
                    Your Reply
                  </p>

                  <p className="text-gray-700">
                    {message.admin_reply}
                  </p>

                </div>

              )}

            </div>

          ))}

        </div>

      )}
            {/* Reply Modal */}
      {selectedMessage && (
        <ReplyModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onReply={handleReply}
        />
      )}

    </div>
  </Layout>
);

}

export default Admin;
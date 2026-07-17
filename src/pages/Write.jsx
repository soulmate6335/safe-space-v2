import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import TextArea from "../components/ui/TextArea";
import PageHeader from "../components/ui/PageHeader";

import { createMessage } from "../services/messageService";
import toast from "react-hot-toast";

function Write() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit() {
    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    try {
      setLoading(true);

      const result = await createMessage(message);

      toast.success("Your message has been sent successfully!");

      navigate("/sent", {
        state: {
          conversationCode: result.conversation_code,
        },
      });
    } catch (err) {
      console.error(err);

      toast.error(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl py-8">
        <PageHeader
          icon="💜"
          title="Share What's On Your Mind"
          subtitle="Take your time. Write as much or as little as you need. Everything you share remains anonymous."
        />

        <Card className="rounded-3xl border border-violet-100 bg-white/90 p-6 shadow-xl shadow-violet-100/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-none">
          <TextArea
            rows={10}
            maxLength={1000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Start writing here..."
            className="min-h-[280px] rounded-2xl border border-gray-200 bg-white px-4 py-4 text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-violet-400 dark:focus:ring-violet-950"
          />

          <div className="mt-4 mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500 dark:text-slate-400">
              Maximum 1000 characters
            </span>

            <span
              className={`text-sm font-medium ${
                message.length > 900
                  ? "text-red-500"
                  : "text-gray-500 dark:text-slate-400"
              }`}
            >
              {message.length}/1000
            </span>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || loading}
            className="w-full justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 px-5 py-3 text-white shadow-lg shadow-violet-200 transition hover:scale-[1.01] hover:shadow-violet-300 disabled:cursor-not-allowed disabled:opacity-70 dark:shadow-violet-950/40"
          >
            {loading ? "Sending..." : "📩 Send Message"}
          </Button>
        </Card>

        <Card className="mt-8 rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-6 dark:border-slate-700 dark:from-slate-900 dark:to-slate-900">
          <div className="grid gap-6 text-center md:grid-cols-3">
            <div>
              <div className="mb-2 text-3xl">🔒</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Anonymous</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                Your identity is never required.
              </p>
            </div>

            <div>
              <div className="mb-2 text-3xl">❤️</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Safe</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                Every message is treated with respect and care.
              </p>
            </div>

            <div>
              <div className="mb-2 text-3xl">🌸</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">You're Heard</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                A founder will read your message and respond when possible.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

export default Write;
import { useState } from "react";

import Layout from "../components/Layout";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import toast from "react-hot-toast";

import { getConversation } from "../services/conversationService";

function CheckReply() {
  const [code, setCode] = useState("");
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!code.trim()) {
      toast("Please enter your conversation code.");
      return;
    }

    try {
      setLoading(true);

      const data = await getConversation(code);

      if (!data) {
        setConversation(null);
        toast.error("Conversation not found.");
        return;
      }

      setConversation(data);
    } catch (error) {
      console.error(error);
      setConversation(null);
      toast.error("Conversation not found.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl py-8">
        <PageHeader
          icon="💬"
          title="Check Your Reply"
          subtitle="Enter the conversation code you received after sending your message."
        />

        <Card className="rounded-3xl border border-violet-100 bg-white/90 p-6 shadow-xl shadow-violet-100/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-none">
          <Input
            placeholder="SS-XXXXXX"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-violet-400 dark:focus:ring-violet-950"
          />

          <div className="mt-5">
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="w-full justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 px-5 py-3 text-white shadow-lg shadow-violet-200 transition hover:scale-[1.01] hover:shadow-violet-300 disabled:cursor-not-allowed disabled:opacity-70 dark:shadow-violet-950/40"
            >
              {loading ? "Checking..." : "Check Reply"}
            </Button>
          </div>
        </Card>

        {loading && <Loader text="Looking for your conversation..." />}

        {!loading && conversation && (
          <Card className="mt-8 rounded-3xl border border-violet-100 bg-white/90 p-6 shadow-xl shadow-violet-100/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-none">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Conversation</h2>
              <Badge status={conversation.admin_reply ? "replied" : "pending"} />
            </div>

            <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
                Conversation Code
              </p>
              <p className="mt-2 font-semibold text-violet-700 dark:text-violet-300">
                {conversation.conversation_code}
              </p>
            </div>

            <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/70">
              <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">💜 Your Message</h3>
              <div className="leading-8 text-gray-700 dark:text-slate-300">{conversation.text}</div>
            </div>

            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 dark:border-violet-900 dark:bg-violet-950/30">
              <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">❤️ Founder's Reply</h3>

              {conversation.admin_reply ? (
                <div className="leading-8 text-gray-700 dark:text-slate-300">
                  {conversation.admin_reply}
                </div>
              ) : (
                <EmptyState
                  title="Awaiting Reply"
                  description="A founder hasn't replied yet. Please check again later using your conversation code."
                />
              )}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}

export default CheckReply;
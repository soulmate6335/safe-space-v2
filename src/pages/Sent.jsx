import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Layout from "../components/Layout";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import toast from "react-hot-toast";

function Sent() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [copied, setCopied] = useState(false);

  const conversationCode =
    state?.conversationCode || "Unavailable";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        conversationCode
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("Unable to copy the code.");
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-2xl py-8">
        <PageHeader
          icon="💜"
          title="Thank You"
          subtitle="Your message has been received safely. Thank you for trusting Safe Space."
        />

        <Card className="rounded-3xl border border-violet-100 bg-white/90 p-8 text-center shadow-xl shadow-violet-100/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-none">
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
            Your Conversation Code
          </h3>

          <div className="mt-6 mb-6 rounded-2xl border-2 border-dashed border-violet-500 bg-violet-50 p-6 dark:bg-violet-950/30">
            <div className="text-3xl font-bold tracking-[0.25em] text-violet-700 dark:text-violet-300">
              {conversationCode}
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={handleCopy}
            className="rounded-2xl"
          >
            {copied ? "✅ Copied!" : "📋 Copy Code"}
          </Button>

          <p className="mt-6 leading-7 text-gray-600 dark:text-slate-400">
            Keep this conversation code in a safe place.
            <br />
            You'll need it whenever you want to check for a founder's reply.
          </p>
        </Card>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Button onClick={() => navigate("/")} className="rounded-2xl">
            🏠 Return Home
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate("/check-reply")}
            className="rounded-2xl"
          >
            💬 Check My Reply
          </Button>
        </div>
      </div>
    </Layout>
  );
}

export default Sent;
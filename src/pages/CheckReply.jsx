import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";

import { getConversationByCode } from "../services/conversationService";

export default function CheckReply() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!code.trim()) {
      toast.error("Please enter your conversation code.");
      return;
    }

    try {
      setLoading(true);

      const conversation = await getConversationByCode(
        code.trim().toUpperCase()
      );

      if (!conversation) {
        toast.error("Conversation not found.");
        return;
      }

      navigate("/conversation", {
        state: {
          conversationId: conversation.id,
          conversationCode: conversation.conversation_code,
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Conversation not found.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-xl py-10">
        <PageHeader
          icon="💜"
          title="Continue Conversation"
          subtitle="Enter your conversation code to continue chatting with the Safe Space team."
        />

        <Card className="p-6 rounded-3xl">
          <Input
            placeholder="SS-XXXXXX"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />

          <div className="mt-6">
            <Button
              className="w-full"
              onClick={handleContinue}
              disabled={loading}
            >
              {loading ? "Opening..." : "Continue Conversation"}
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
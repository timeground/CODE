import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  TIMEGROUND_AGENT,
  prepareAgentRequest,
  formatRoutingMessage,
  callLLM,
  createMessage,
  type ChatMessage,
} from "@timeground/agent-core";
import type { RouterConfig } from "@timeground/ai-router";
import type { ProviderId } from "@timeground/model-registry";
import { PROVIDERS } from "@timeground/model-registry";
import "./ChatPanel.css";

interface Props {
  width: number;
  openFileCount: number;
  hasOpenFiles: boolean;
  qualityMode: 0 | 1 | 2;
  onQualityModeChange?: () => void;
}

export function ChatPanel({
  width,
  openFileCount,
  hasOpenFiles,
  qualityMode,
  onQualityModeChange,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("assistant", TIMEGROUND_AGENT.greeting),
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getRouterConfig = useCallback(async (): Promise<RouterConfig> => {
    const settings = await window.timeground.getSettings();
    const availableProviders = Object.keys(PROVIDERS).filter(
      (p) => settings[`apikey_${p}`]
    ) as ProviderId[];

    if (settings.apikey_ollama || !availableProviders.length) {
      availableProviders.push("ollama");
    }

    const budget = parseFloat(settings.budget_cap ?? "0") || 0;

    return {
      availableProviders,
      qualityMode,
      budgetCapUsd: budget,
      preferLocal: settings.prefer_local === "true",
    };
  }, [qualityMode]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = createMessage("user", text);
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const config = await getRouterConfig();
      const { routing, request } = prepareAgentRequest(text, messages, config, {
        fileCount: openFileCount,
        hasOpenFiles,
      });

      const routingNote = createMessage("assistant", formatRoutingMessage(routing));
      routingNote.modelId = routing.model.id;

      const settings = await window.timeground.getSettings();
      const apiKey = settings[`apikey_${routing.model.provider}`] ?? "";

      if (!apiKey && routing.model.requiresUserKey) {
        const helpMsg = createMessage(
          "assistant",
          `I'd love to help with that! To get started, you'll need to add your **${PROVIDERS[routing.model.provider].name}** API key in Settings (gear icon, top right).\n\nOnce that's in, I'll automatically pick the best model for each task — no extra setup needed.`
        );
        setMessages((prev) => [...prev, routingNote, helpMsg]);
        return;
      }

      setMessages((prev) => [...prev, routingNote]);

      const response = await callLLM(request, apiKey || "ollama");

      const assistantMsg = createMessage("assistant", response.content);
      assistantMsg.modelId = routing.model.id;
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg = createMessage(
        "assistant",
        `Hmm, something went wrong on my end. ${err instanceof Error ? err.message : "Unknown error"}\n\nCould you try again? If it keeps happening, check your API key in Settings.`
      );
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <aside className="chat-panel" style={{ width }}>
      <div className="chat-header">
        <span className="chat-header-title">Ground</span>
        <div className="chat-header-actions">
          <button className="chat-header-btn" type="button">New Agent</button>
        </div>
      </div>

      <div className="quality-selector">
        {(["Fast", "Balanced", "Best"] as const).map((label, i) => (
          <button
            key={label}
            className={`quality-btn ${qualityMode === i ? "active" : ""}`}
            onClick={async () => {
              await window.timeground.setSetting("quality_mode", String(i));
              onQualityModeChange?.();
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.role} animate-fade-in`}
          >
            <div className="msg-content">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
              {msg.modelId && (
                <span className="msg-model">{msg.modelId}</span>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-message assistant animate-fade-in">
            <div className="msg-content typing">
              <Loader2 size={12} className="spin" />
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder="Plan, search, build anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          className="chat-send"
          onClick={sendMessage}
          disabled={!input.trim() || loading}
        >
          <Send size={16} />
        </button>
      </div>
    </aside>
  );
}

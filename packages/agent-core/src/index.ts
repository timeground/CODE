import { routeTask, type RouterConfig, type RoutingDecision } from "@timeground/ai-router";
import type { ProviderId } from "@timeground/model-registry";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  modelId?: string;
  routing?: RoutingDecision;
}

export interface AgentPersonality {
  name: string;
  tone: "warm" | "professional" | "concise";
  greeting: string;
}

export const TIMEGROUND_AGENT: AgentPersonality = {
  name: "Ground",
  tone: "warm",
  greeting:
    "Hey there! I'm Ground, your coding companion from TimeGround. Whether you're building something new or untangling a tricky bug — I'm here with you. What are we working on today?",
};

export const SYSTEM_PROMPT = `You are Ground, the AI assistant inside TimeGround Code — a beautiful, intelligent code editor built by TimeGround LLP (timeground.in).

Your personality:
- Warm, encouraging, and human — never robotic or cold
- Clear and simple — explain things so anyone can follow, without dumbing down
- Confident but humble — say when you're unsure
- Focused on the user's goal, not showing off

Your capabilities:
- Read, write, and refactor code across any language
- Debug issues step by step
- Design architecture and explain trade-offs
- Run terminal commands when in agent mode

Guidelines:
- Use short paragraphs and bullet points when helpful
- Celebrate small wins ("Nice — that compiles cleanly now!")
- When suggesting code changes, explain the why briefly
- If a task is complex, break it into clear steps
- Never be condescending — meet the developer where they are
- Sign off naturally, never with corporate filler

You represent TimeGround's philosophy: "Build quietly. Let the work speak the loudest."`;

export interface LLMRequest {
  model: string;
  provider: ProviderId;
  providerModelId: string;
  messages: Array<{ role: string; content: string }>;
  apiKey?: string;
  apiBase?: string;
  stream?: boolean;
}

export interface LLMResponse {
  content: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  costUsd?: number;
}

export function prepareAgentRequest(
  userMessage: string,
  history: ChatMessage[],
  routerConfig: RouterConfig,
  context?: { fileCount?: number; hasOpenFiles?: boolean }
): { routing: RoutingDecision; request: LLMRequest } {
  const routing = routeTask(userMessage, routerConfig, {
    ...context,
    hasOpenFiles: context?.hasOpenFiles ?? true,
  });

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  return {
    routing,
    request: {
      model: routing.model.id,
      provider: routing.model.provider,
      providerModelId: routing.model.providerModelId,
      messages,
      apiBase: routing.model.apiBase,
      stream: true,
    },
  };
}

/** Warm-toned wrapper for routing explanation shown to user */
export function formatRoutingMessage(routing: RoutingDecision): string {
  const { model, analysis, estimatedCostUsd } = routing;
  const costStr =
    estimatedCostUsd < 0.001
      ? "free"
      : estimatedCostUsd < 0.01
        ? "under a penny"
        : `~$${estimatedCostUsd.toFixed(3)}`;

  if (model.tier === "open_source") {
    return `I'll handle this locally with **${model.name}** — private and free. ✨`;
  }

  if (analysis.complexity === "expert" || analysis.complexity === "complex") {
    return `This looks like important work — I'm bringing in **${model.name}** for the best results (${costStr}).`;
  }

  return `On it! Using **${model.name}** — great fit for this task (${costStr}).`;
}

/** Call LLM API (OpenAI-compatible or Anthropic) */
export async function callLLM(
  request: LLMRequest,
  apiKey: string
): Promise<LLMResponse> {
  const isAnthropic = request.provider === "anthropic";

  if (isAnthropic) {
    return callAnthropic(request, apiKey);
  }

  return callOpenAICompatible(request, apiKey);
}

async function callOpenAICompatible(
  request: LLMRequest,
  apiKey: string
): Promise<LLMResponse> {
  const baseUrls: Partial<Record<ProviderId, string>> = {
    openai: "https://api.openai.com/v1",
    google: "https://generativelanguage.googleapis.com/v1beta/openai",
    deepseek: "https://api.deepseek.com/v1",
    xai: "https://api.x.ai/v1",
    mistral: "https://api.mistral.ai/v1",
    groq: "https://api.groq.com/openai/v1",
    together: "https://api.together.xyz/v1",
    fireworks: "https://api.fireworks.ai/inference/v1",
    openrouter: "https://openrouter.ai/api/v1",
    ollama: "http://localhost:11434/v1",
  };

  const base = request.apiBase ?? baseUrls[request.provider] ?? "https://api.openai.com/v1";

  const response = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(request.provider === "openrouter"
        ? { "HTTP-Referer": "https://timeground.in", "X-Title": "TimeGround Code" }
        : {}),
    },
    body: JSON.stringify({
      model: request.providerModelId,
      messages: request.messages,
      stream: false,
      max_tokens: 8192,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error (${response.status}): ${err}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
    usage?: { prompt_tokens: number; completion_tokens: number };
  };

  return {
    content: data.choices[0]?.message?.content ?? "",
    model: request.model,
    inputTokens: data.usage?.prompt_tokens,
    outputTokens: data.usage?.completion_tokens,
  };
}

async function callAnthropic(
  request: LLMRequest,
  apiKey: string
): Promise<LLMResponse> {
  const systemMsg = request.messages.find((m) => m.role === "system")?.content ?? "";
  const otherMsgs = request.messages.filter((m) => m.role !== "system");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: request.providerModelId,
      max_tokens: 8192,
      system: systemMsg,
      messages: otherMsgs.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${err}`);
  }

  const data = (await response.json()) as {
    content: Array<{ text: string }>;
    usage?: { input_tokens: number; output_tokens: number };
  };

  return {
    content: data.content.map((c) => c.text).join(""),
    model: request.model,
    inputTokens: data.usage?.input_tokens,
    outputTokens: data.usage?.output_tokens,
  };
}

export function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    role,
    content,
    timestamp: Date.now(),
  };
}

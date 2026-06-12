/** Task categories the router can classify user intent into */
export type TaskCategory =
  | "code_generation"
  | "code_review"
  | "debugging"
  | "refactoring"
  | "architecture"
  | "documentation"
  | "chat"
  | "autocomplete"
  | "test_generation"
  | "security_audit"
  | "data_analysis"
  | "translation"
  | "summarization"
  | "agentic_coding"
  | "vision"
  | "embedding";

export type ModelTier =
  | "frontier"      // Most expensive, highest capability
  | "premium"
  | "standard"
  | "economy"
  | "budget"
  | "free"
  | "open_source";

export type ProviderId =
  | "anthropic"
  | "openai"
  | "google"
  | "deepseek"
  | "xai"
  | "mistral"
  | "cohere"
  | "meta"
  | "alibaba"
  | "minimax"
  | "zhipu"
  | "moonshot"
  | "together"
  | "groq"
  | "fireworks"
  | "ollama"
  | "openrouter"
  | "timeground";

export interface ModelPricing {
  /** USD per 1M input tokens */
  inputPer1M: number;
  /** USD per 1M output tokens */
  outputPer1M: number;
  /** Cached input discount multiplier (0.1 = 90% off) */
  cacheHitMultiplier?: number;
  /** Batch discount multiplier (0.5 = 50% off) */
  batchMultiplier?: number;
}

export interface ModelCapabilities {
  coding: number;       // 0-100 SWE-bench proxy
  reasoning: number;    // 0-100
  speed: number;        // 0-100 tokens/sec proxy
  contextWindow: number;
  maxOutput: number;
  supportsTools: boolean;
  supportsVision: boolean;
  supportsStreaming: boolean;
  supportsCaching: boolean;
  openWeights: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  provider: ProviderId;
  providerModelId: string;
  tier: ModelTier;
  pricing: ModelPricing;
  capabilities: ModelCapabilities;
  /** Best task categories for this model */
  strengths: TaskCategory[];
  /** API endpoint base (OpenAI-compatible where noted) */
  apiBase?: string;
  /** Requires user's own API key */
  requiresUserKey: boolean;
  /** Available on free tier from provider */
  hasFreeTier: boolean;
  /** TimeGround margin multiplier when reselling (1.0 = pass-through) */
  timegroundMargin: number;
  notes?: string;
}

export interface ProviderInfo {
  id: ProviderId;
  name: string;
  website: string;
  docsUrl: string;
  keyUrl: string;
  openaiCompatible: boolean;
  anthropicCompatible: boolean;
}

export const PROVIDERS: Record<ProviderId, ProviderInfo> = {
  anthropic: {
    id: "anthropic",
    name: "Anthropic",
    website: "https://anthropic.com",
    docsUrl: "https://docs.anthropic.com",
    keyUrl: "https://console.anthropic.com/settings/keys",
    openaiCompatible: false,
    anthropicCompatible: true,
  },
  openai: {
    id: "openai",
    name: "OpenAI",
    website: "https://openai.com",
    docsUrl: "https://platform.openai.com/docs",
    keyUrl: "https://platform.openai.com/api-keys",
    openaiCompatible: true,
    anthropicCompatible: false,
  },
  google: {
    id: "google",
    name: "Google (Gemini)",
    website: "https://ai.google.dev",
    docsUrl: "https://ai.google.dev/docs",
    keyUrl: "https://aistudio.google.com/apikey",
    openaiCompatible: true,
    anthropicCompatible: false,
  },
  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    website: "https://deepseek.com",
    docsUrl: "https://api-docs.deepseek.com",
    keyUrl: "https://platform.deepseek.com/api_keys",
    openaiCompatible: true,
    anthropicCompatible: true,
  },
  xai: {
    id: "xai",
    name: "xAI (Grok)",
    website: "https://x.ai",
    docsUrl: "https://docs.x.ai",
    keyUrl: "https://console.x.ai",
    openaiCompatible: true,
    anthropicCompatible: false,
  },
  mistral: {
    id: "mistral",
    name: "Mistral AI",
    website: "https://mistral.ai",
    docsUrl: "https://docs.mistral.ai",
    keyUrl: "https://console.mistral.ai/api-keys",
    openaiCompatible: true,
    anthropicCompatible: false,
  },
  cohere: {
    id: "cohere",
    name: "Cohere",
    website: "https://cohere.com",
    docsUrl: "https://docs.cohere.com",
    keyUrl: "https://dashboard.cohere.com/api-keys",
    openaiCompatible: true,
    anthropicCompatible: false,
  },
  meta: {
    id: "meta",
    name: "Meta (Llama)",
    website: "https://llama.meta.com",
    docsUrl: "https://llama.meta.com/docs",
    keyUrl: "https://llama.developer.meta.com",
    openaiCompatible: true,
    anthropicCompatible: false,
  },
  alibaba: {
    id: "alibaba",
    name: "Alibaba (Qwen)",
    website: "https://qwen.ai",
    docsUrl: "https://help.aliyun.com/zh/model-studio",
    keyUrl: "https://dashscope.console.aliyun.com",
    openaiCompatible: true,
    anthropicCompatible: false,
  },
  minimax: {
    id: "minimax",
    name: "MiniMax",
    website: "https://minimax.io",
    docsUrl: "https://platform.minimax.io/docs",
    keyUrl: "https://platform.minimax.io/user-center/basic-information",
    openaiCompatible: true,
    anthropicCompatible: false,
  },
  zhipu: {
    id: "zhipu",
    name: "Zhipu (GLM)",
    website: "https://zhipuai.cn",
    docsUrl: "https://open.bigmodel.cn/dev/api",
    keyUrl: "https://open.bigmodel.cn/usercenter/apikeys",
    openaiCompatible: true,
    anthropicCompatible: false,
  },
  moonshot: {
    id: "moonshot",
    name: "Moonshot (Kimi)",
    website: "https://moonshot.ai",
    docsUrl: "https://platform.moonshot.cn/docs",
    keyUrl: "https://platform.moonshot.cn/console/api-keys",
    openaiCompatible: true,
    anthropicCompatible: false,
  },
  together: {
    id: "together",
    name: "Together AI",
    website: "https://together.ai",
    docsUrl: "https://docs.together.ai",
    keyUrl: "https://api.together.xyz/settings/api-keys",
    openaiCompatible: true,
    anthropicCompatible: false,
  },
  groq: {
    id: "groq",
    name: "Groq",
    website: "https://groq.com",
    docsUrl: "https://console.groq.com/docs",
    keyUrl: "https://console.groq.com/keys",
    openaiCompatible: true,
    anthropicCompatible: false,
  },
  fireworks: {
    id: "fireworks",
    name: "Fireworks AI",
    website: "https://fireworks.ai",
    docsUrl: "https://docs.fireworks.ai",
    keyUrl: "https://fireworks.ai/account/api-keys",
    openaiCompatible: true,
    anthropicCompatible: false,
  },
  ollama: {
    id: "ollama",
    name: "Ollama (Local)",
    website: "https://ollama.com",
    docsUrl: "https://github.com/ollama/ollama/blob/main/docs/api.md",
    keyUrl: "https://ollama.com",
    openaiCompatible: true,
    anthropicCompatible: false,
  },
  openrouter: {
    id: "openrouter",
    name: "OpenRouter",
    website: "https://openrouter.ai",
    docsUrl: "https://openrouter.ai/docs",
    keyUrl: "https://openrouter.ai/keys",
    openaiCompatible: true,
    anthropicCompatible: false,
  },
  timeground: {
    id: "timeground",
    name: "TimeGround",
    website: "https://timeground.in",
    docsUrl: "https://timeground.in",
    keyUrl: "https://timeground.in",
    openaiCompatible: true,
    anthropicCompatible: false,
  },
};

/**
 * Global AI model catalog — sorted by tier (frontier → open_source).
 * Pricing verified June 2026. Update quarterly.
 */
export const MODEL_CATALOG: AIModel[] = [
  // ─── FRONTIER ($10+/M input) ───────────────────────────────────────────
  {
    id: "claude-fable-5",
    name: "Claude Fable 5",
    provider: "anthropic",
    providerModelId: "claude-fable-5",
    tier: "frontier",
    pricing: { inputPer1M: 10, outputPer1M: 50, cacheHitMultiplier: 0.1 },
    capabilities: {
      coding: 95, reasoning: 98, speed: 70, contextWindow: 1_000_000,
      maxOutput: 64_000, supportsTools: true, supportsVision: true,
      supportsStreaming: true, supportsCaching: true, openWeights: false,
    },
    strengths: ["agentic_coding", "architecture", "code_review", "security_audit", "debugging"],
    requiresUserKey: true, hasFreeTier: false, timegroundMargin: 1.15,
    notes: "Highest SWE-bench. Adaptive reasoning always on.",
  },
  {
    id: "claude-mythos-5",
    name: "Claude Mythos 5",
    provider: "anthropic",
    providerModelId: "claude-mythos-5",
    tier: "frontier",
    pricing: { inputPer1M: 10, outputPer1M: 50, cacheHitMultiplier: 0.1 },
    capabilities: {
      coding: 94, reasoning: 99, speed: 65, contextWindow: 1_000_000,
      maxOutput: 64_000, supportsTools: true, supportsVision: true,
      supportsStreaming: true, supportsCaching: true, openWeights: false,
    },
    strengths: ["architecture", "agentic_coding", "data_analysis", "security_audit"],
    requiresUserKey: true, hasFreeTier: false, timegroundMargin: 1.15,
  },
  {
    id: "gpt-5.5",
    name: "GPT-5.5",
    provider: "openai",
    providerModelId: "gpt-5.5",
    tier: "frontier",
    pricing: { inputPer1M: 5, outputPer1M: 30, cacheHitMultiplier: 0.1 },
    capabilities: {
      coding: 92, reasoning: 96, speed: 75, contextWindow: 400_000,
      maxOutput: 32_000, supportsTools: true, supportsVision: true,
      supportsStreaming: true, supportsCaching: true, openWeights: false,
    },
    strengths: ["agentic_coding", "code_generation", "architecture", "data_analysis"],
    requiresUserKey: true, hasFreeTier: false, timegroundMargin: 1.12,
  },

  // ─── PREMIUM ($3-10/M input) ───────────────────────────────────────────
  {
    id: "claude-opus-4.8",
    name: "Claude Opus 4.8",
    provider: "anthropic",
    providerModelId: "claude-opus-4-8",
    tier: "premium",
    pricing: { inputPer1M: 5, outputPer1M: 25, cacheHitMultiplier: 0.1 },
    capabilities: {
      coding: 89, reasoning: 94, speed: 80, contextWindow: 1_000_000,
      maxOutput: 32_000, supportsTools: true, supportsVision: true,
      supportsStreaming: true, supportsCaching: true, openWeights: false,
    },
    strengths: ["code_generation", "refactoring", "debugging", "code_review"],
    requiresUserKey: true, hasFreeTier: false, timegroundMargin: 1.10,
    notes: "Best price-performance for complex coding.",
  },
  {
    id: "gpt-5.4",
    name: "GPT-5.4",
    provider: "openai",
    providerModelId: "gpt-5.4",
    tier: "premium",
    pricing: { inputPer1M: 2.5, outputPer1M: 15, cacheHitMultiplier: 0.1 },
    capabilities: {
      coding: 88, reasoning: 91, speed: 85, contextWindow: 256_000,
      maxOutput: 16_000, supportsTools: true, supportsVision: true,
      supportsStreaming: true, supportsCaching: true, openWeights: false,
    },
    strengths: ["code_generation", "chat", "documentation", "test_generation"],
    requiresUserKey: true, hasFreeTier: false, timegroundMargin: 1.10,
  },
  {
    id: "claude-sonnet-4.6",
    name: "Claude Sonnet 4.6",
    provider: "anthropic",
    providerModelId: "claude-sonnet-4-6",
    tier: "premium",
    pricing: { inputPer1M: 3, outputPer1M: 15, cacheHitMultiplier: 0.1 },
    capabilities: {
      coding: 87, reasoning: 90, speed: 88, contextWindow: 1_000_000,
      maxOutput: 16_000, supportsTools: true, supportsVision: true,
      supportsStreaming: true, supportsCaching: true, openWeights: false,
    },
    strengths: ["code_generation", "refactoring", "chat", "documentation"],
    requiresUserKey: true, hasFreeTier: false, timegroundMargin: 1.08,
  },
  {
    id: "gemini-3.1-pro",
    name: "Gemini 3.1 Pro",
    provider: "google",
    providerModelId: "gemini-3.1-pro",
    tier: "premium",
    pricing: { inputPer1M: 2, outputPer1M: 12, cacheHitMultiplier: 0.25 },
    capabilities: {
      coding: 86, reasoning: 92, speed: 82, contextWindow: 2_000_000,
      maxOutput: 16_000, supportsTools: true, supportsVision: true,
      supportsStreaming: true, supportsCaching: true, openWeights: false,
    },
    strengths: ["agentic_coding", "vision", "data_analysis", "architecture"],
    requiresUserKey: true, hasFreeTier: true, timegroundMargin: 1.08,
  },
  {
    id: "grok-4.3",
    name: "Grok 4.3",
    provider: "xai",
    providerModelId: "grok-4.3",
    tier: "premium",
    pricing: { inputPer1M: 3, outputPer1M: 15 },
    capabilities: {
      coding: 84, reasoning: 88, speed: 90, contextWindow: 256_000,
      maxOutput: 16_000, supportsTools: true, supportsVision: true,
      supportsStreaming: true, supportsCaching: false, openWeights: false,
    },
    strengths: ["chat", "code_generation", "data_analysis"],
    requiresUserKey: true, hasFreeTier: false, timegroundMargin: 1.10,
  },

  // ─── STANDARD ($1-3/M input) ───────────────────────────────────────────
  {
    id: "gemini-3.5-flash",
    name: "Gemini 3.5 Flash",
    provider: "google",
    providerModelId: "gemini-3.5-flash",
    tier: "standard",
    pricing: { inputPer1M: 1.5, outputPer1M: 9, cacheHitMultiplier: 0.25 },
    capabilities: {
      coding: 82, reasoning: 85, speed: 95, contextWindow: 1_000_000,
      maxOutput: 8_000, supportsTools: true, supportsVision: true,
      supportsStreaming: true, supportsCaching: true, openWeights: false,
    },
    strengths: ["agentic_coding", "autocomplete", "chat", "code_generation"],
    requiresUserKey: true, hasFreeTier: true, timegroundMargin: 1.05,
  },
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    provider: "openai",
    providerModelId: "gpt-4.1",
    tier: "standard",
    pricing: { inputPer1M: 2, outputPer1M: 8, cacheHitMultiplier: 0.1 },
    capabilities: {
      coding: 83, reasoning: 86, speed: 88, contextWindow: 1_000_000,
      maxOutput: 8_000, supportsTools: true, supportsVision: true,
      supportsStreaming: true, supportsCaching: true, openWeights: false,
    },
    strengths: ["code_generation", "refactoring", "documentation"],
    requiresUserKey: true, hasFreeTier: false, timegroundMargin: 1.05,
  },
  {
    id: "mistral-large-3",
    name: "Mistral Large 3",
    provider: "mistral",
    providerModelId: "mistral-large-latest",
    tier: "standard",
    pricing: { inputPer1M: 2, outputPer1M: 6 },
    capabilities: {
      coding: 80, reasoning: 84, speed: 85, contextWindow: 128_000,
      maxOutput: 8_000, supportsTools: true, supportsVision: false,
      supportsStreaming: true, supportsCaching: false, openWeights: false,
    },
    strengths: ["code_generation", "translation", "chat"],
    requiresUserKey: true, hasFreeTier: false, timegroundMargin: 1.05,
  },
  {
    id: "qwen3.7-max",
    name: "Qwen 3.7 Max",
    provider: "alibaba",
    providerModelId: "qwen-max",
    tier: "standard",
    pricing: { inputPer1M: 2.5, outputPer1M: 10 },
    capabilities: {
      coding: 81, reasoning: 85, speed: 82, contextWindow: 256_000,
      maxOutput: 8_000, supportsTools: true, supportsVision: true,
      supportsStreaming: true, supportsCaching: false, openWeights: false,
    },
    strengths: ["code_generation", "translation", "data_analysis"],
    requiresUserKey: true, hasFreeTier: true, timegroundMargin: 1.05,
  },

  // ─── ECONOMY ($0.3-1/M input) ──────────────────────────────────────────
  {
    id: "gemini-3.1-flash-lite",
    name: "Gemini 3.1 Flash-Lite",
    provider: "google",
    providerModelId: "gemini-3.1-flash-lite",
    tier: "economy",
    pricing: { inputPer1M: 0.25, outputPer1M: 1.5 },
    capabilities: {
      coding: 72, reasoning: 75, speed: 98, contextWindow: 1_000_000,
      maxOutput: 4_000, supportsTools: true, supportsVision: false,
      supportsStreaming: true, supportsCaching: true, openWeights: false,
    },
    strengths: ["autocomplete", "chat", "summarization"],
    requiresUserKey: true, hasFreeTier: true, timegroundMargin: 1.20,
    notes: "High margin on cheap tasks — ideal for autocomplete routing.",
  },
  {
    id: "gpt-4.1-mini",
    name: "GPT-4.1 Mini",
    provider: "openai",
    providerModelId: "gpt-4.1-mini",
    tier: "economy",
    pricing: { inputPer1M: 0.4, outputPer1M: 1.6, cacheHitMultiplier: 0.1 },
    capabilities: {
      coding: 75, reasoning: 78, speed: 95, contextWindow: 256_000,
      maxOutput: 4_000, supportsTools: true, supportsVision: false,
      supportsStreaming: true, supportsCaching: true, openWeights: false,
    },
    strengths: ["autocomplete", "chat", "documentation", "summarization"],
    requiresUserKey: true, hasFreeTier: false, timegroundMargin: 1.15,
  },
  {
    id: "minimax-m3",
    name: "MiniMax M3",
    provider: "minimax",
    providerModelId: "MiniMax-M3",
    tier: "economy",
    pricing: { inputPer1M: 0.3, outputPer1M: 1.2 },
    capabilities: {
      coding: 81, reasoning: 80, speed: 88, contextWindow: 128_000,
      maxOutput: 8_000, supportsTools: true, supportsVision: false,
      supportsStreaming: true, supportsCaching: false, openWeights: false,
    },
    strengths: ["code_generation", "refactoring", "chat"],
    requiresUserKey: true, hasFreeTier: false, timegroundMargin: 1.18,
    notes: "Cheapest model above 80% SWE-bench.",
  },
  {
    id: "deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    provider: "deepseek",
    providerModelId: "deepseek-v4-pro",
    tier: "economy",
    pricing: { inputPer1M: 0.55, outputPer1M: 0.87, cacheHitMultiplier: 0.1 },
    capabilities: {
      coding: 81, reasoning: 85, speed: 80, contextWindow: 1_000_000,
      maxOutput: 384_000, supportsTools: true, supportsVision: false,
      supportsStreaming: true, supportsCaching: true, openWeights: true,
    },
    strengths: ["code_generation", "refactoring", "debugging", "agentic_coding"],
    requiresUserKey: true, hasFreeTier: false, timegroundMargin: 1.12,
    notes: "Open weights MIT. Best value for serious coding.",
  },

  // ─── BUDGET ($0.1-0.3/M input) ─────────────────────────────────────────
  {
    id: "deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    provider: "deepseek",
    providerModelId: "deepseek-v4-flash",
    tier: "budget",
    pricing: { inputPer1M: 0.14, outputPer1M: 0.28, cacheHitMultiplier: 0.1 },
    capabilities: {
      coding: 76, reasoning: 78, speed: 92, contextWindow: 1_000_000,
      maxOutput: 384_000, supportsTools: true, supportsVision: false,
      supportsStreaming: true, supportsCaching: true, openWeights: true,
    },
    strengths: ["autocomplete", "chat", "summarization", "documentation"],
    requiresUserKey: true, hasFreeTier: false, timegroundMargin: 1.25,
    notes: "Market price floor. Route bulk/simple tasks here.",
  },
  {
    id: "gpt-4.1-nano",
    name: "GPT-4.1 Nano",
    provider: "openai",
    providerModelId: "gpt-4.1-nano",
    tier: "budget",
    pricing: { inputPer1M: 0.1, outputPer1M: 0.4, cacheHitMultiplier: 0.1 },
    capabilities: {
      coding: 68, reasoning: 70, speed: 98, contextWindow: 128_000,
      maxOutput: 2_000, supportsTools: false, supportsVision: false,
      supportsStreaming: true, supportsCaching: true, openWeights: false,
    },
    strengths: ["autocomplete", "summarization", "translation"],
    requiresUserKey: true, hasFreeTier: false, timegroundMargin: 1.30,
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "google",
    providerModelId: "gemini-2.5-flash",
    tier: "budget",
    pricing: { inputPer1M: 0.15, outputPer1M: 0.6 },
    capabilities: {
      coding: 74, reasoning: 76, speed: 96, contextWindow: 1_000_000,
      maxOutput: 4_000, supportsTools: true, supportsVision: true,
      supportsStreaming: true, supportsCaching: true, openWeights: false,
    },
    strengths: ["chat", "autocomplete", "summarization"],
    requiresUserKey: true, hasFreeTier: true, timegroundMargin: 1.25,
  },

  // ─── FREE ──────────────────────────────────────────────────────────────
  {
    id: "glm-4.7-flash",
    name: "GLM-4.7 Flash",
    provider: "zhipu",
    providerModelId: "glm-4-flash",
    tier: "free",
    pricing: { inputPer1M: 0, outputPer1M: 0 },
    capabilities: {
      coding: 65, reasoning: 68, speed: 90, contextWindow: 128_000,
      maxOutput: 4_000, supportsTools: false, supportsVision: false,
      supportsStreaming: true, supportsCaching: false, openWeights: false,
    },
    strengths: ["chat", "summarization"],
    requiresUserKey: true, hasFreeTier: true, timegroundMargin: 0,
    notes: "Free tier from Zhipu. Good onboarding hook.",
  },
  {
    id: "gemini-2.5-flash-free",
    name: "Gemini 2.5 Flash (Free Tier)",
    provider: "google",
    providerModelId: "gemini-2.5-flash",
    tier: "free",
    pricing: { inputPer1M: 0, outputPer1M: 0 },
    capabilities: {
      coding: 72, reasoning: 74, speed: 94, contextWindow: 1_000_000,
      maxOutput: 4_000, supportsTools: true, supportsVision: true,
      supportsStreaming: true, supportsCaching: false, openWeights: false,
    },
    strengths: ["chat", "documentation", "summarization"],
    requiresUserKey: true, hasFreeTier: true, timegroundMargin: 0,
    notes: "Google AI Studio free quota.",
  },

  // ─── OPEN SOURCE (self-hosted via Ollama/Together) ─────────────────────
  {
    id: "deepseek-v4-pro-local",
    name: "DeepSeek V4 Pro (Local)",
    provider: "ollama",
    providerModelId: "deepseek-v4-pro",
    tier: "open_source",
    pricing: { inputPer1M: 0, outputPer1M: 0 },
    capabilities: {
      coding: 81, reasoning: 85, speed: 40, contextWindow: 1_000_000,
      maxOutput: 32_000, supportsTools: true, supportsVision: false,
      supportsStreaming: true, supportsCaching: false, openWeights: true,
    },
    strengths: ["code_generation", "refactoring", "debugging"],
    apiBase: "http://localhost:11434/v1",
    requiresUserKey: false, hasFreeTier: true, timegroundMargin: 0,
    notes: "MIT license. 1.6T params. Run locally for zero API cost.",
  },
  {
    id: "llama-4-scout",
    name: "Llama 4 Scout",
    provider: "ollama",
    providerModelId: "llama4-scout",
    tier: "open_source",
    pricing: { inputPer1M: 0, outputPer1M: 0 },
    capabilities: {
      coding: 70, reasoning: 72, speed: 55, contextWindow: 128_000,
      maxOutput: 8_000, supportsTools: true, supportsVision: false,
      supportsStreaming: true, supportsCaching: false, openWeights: true,
    },
    strengths: ["chat", "code_generation", "documentation"],
    apiBase: "http://localhost:11434/v1",
    requiresUserKey: false, hasFreeTier: true, timegroundMargin: 0,
  },
  {
    id: "qwen3-coder",
    name: "Qwen3 Coder (Local)",
    provider: "ollama",
    providerModelId: "qwen3-coder",
    tier: "open_source",
    pricing: { inputPer1M: 0, outputPer1M: 0 },
    capabilities: {
      coding: 78, reasoning: 76, speed: 50, contextWindow: 256_000,
      maxOutput: 16_000, supportsTools: true, supportsVision: false,
      supportsStreaming: true, supportsCaching: false, openWeights: true,
    },
    strengths: ["code_generation", "refactoring", "debugging"],
    apiBase: "http://localhost:11434/v1",
    requiresUserKey: false, hasFreeTier: true, timegroundMargin: 0,
  },
  {
    id: "codestral-22b",
    name: "Codestral 22B (Local)",
    provider: "ollama",
    providerModelId: "codestral",
    tier: "open_source",
    pricing: { inputPer1M: 0, outputPer1M: 0 },
    capabilities: {
      coding: 74, reasoning: 70, speed: 60, contextWindow: 32_000,
      maxOutput: 4_000, supportsTools: false, supportsVision: false,
      supportsStreaming: true, supportsCaching: false, openWeights: true,
    },
    strengths: ["autocomplete", "code_generation"],
    apiBase: "http://localhost:11434/v1",
    requiresUserKey: false, hasFreeTier: true, timegroundMargin: 0,
  },
];

/** Sort models by input price descending (most expensive first) */
export function getModelsByPriceDesc(): AIModel[] {
  return [...MODEL_CATALOG].sort(
    (a, b) => b.pricing.inputPer1M - a.pricing.inputPer1M
  );
}

/** Get models filtered by tier */
export function getModelsByTier(tier: ModelTier): AIModel[] {
  return MODEL_CATALOG.filter((m) => m.tier === tier);
}

/** Get model by ID */
export function getModel(id: string): AIModel | undefined {
  return MODEL_CATALOG.find((m) => m.id === id);
}

/** Estimate cost for a request in USD */
export function estimateCost(
  model: AIModel,
  inputTokens: number,
  outputTokens: number,
  options?: { cached?: boolean; batch?: boolean }
): number {
  let inputRate = model.pricing.inputPer1M;
  let outputRate = model.pricing.outputPer1M;

  if (options?.cached && model.pricing.cacheHitMultiplier) {
    inputRate *= model.pricing.cacheHitMultiplier;
  }
  if (options?.batch && model.pricing.batchMultiplier) {
    inputRate *= model.pricing.batchMultiplier;
    outputRate *= model.pricing.batchMultiplier;
  }

  const base =
    (inputTokens / 1_000_000) * inputRate +
    (outputTokens / 1_000_000) * outputRate;

  return base * model.timegroundMargin;
}

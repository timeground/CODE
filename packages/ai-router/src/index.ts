import {
  MODEL_CATALOG,
  type AIModel,
  type TaskCategory,
  type ProviderId,
  estimateCost,
} from "@timeground/model-registry";

export interface RouterConfig {
  /** User's configured API keys by provider */
  availableProviders: ProviderId[];
  /** Quality priority: 0 = cheapest, 1 = balanced, 2 = max quality */
  qualityMode: 0 | 1 | 2;
  /** Monthly budget cap in USD (0 = unlimited) */
  budgetCapUsd: number;
  /** Prefer local/open-source when capable enough */
  preferLocal: boolean;
  /** Minimum coding score required for the task */
  minCodingScore?: number;
}

export interface TaskAnalysis {
  category: TaskCategory;
  complexity: "trivial" | "simple" | "moderate" | "complex" | "expert";
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  requiresTools: boolean;
  requiresVision: boolean;
  urgency: "instant" | "normal" | "background";
  confidence: number;
}

export interface RoutingDecision {
  model: AIModel;
  analysis: TaskAnalysis;
  estimatedCostUsd: number;
  estimatedMarginUsd: number;
  reasoning: string;
  fallbacks: AIModel[];
  score: number;
}

const COMPLEXITY_KEYWORDS: Record<TaskAnalysis["complexity"], string[]> = {
  trivial: ["what is", "define", "explain briefly", "hello", "hi", "thanks"],
  simple: ["how to", "example", "snippet", "quick", "simple", "fix typo"],
  moderate: ["implement", "create", "add feature", "write function", "component"],
  complex: ["refactor", "architect", "multi-file", "migrate", "debug", "optimize"],
  expert: ["system design", "security audit", "full app", "entire codebase", "agent"],
};

const CATEGORY_PATTERNS: Array<{ category: TaskCategory; patterns: RegExp[] }> = [
  { category: "agentic_coding", patterns: [/build (an |a )?app/i, /full project/i, /scaffold/i, /create project/i] },
  { category: "architecture", patterns: [/architect/i, /system design/i, /structure/i, /monorepo/i] },
  { category: "debugging", patterns: [/debug/i, /error/i, /bug/i, /fix/i, /crash/i, /not working/i] },
  { category: "refactoring", patterns: [/refactor/i, /clean up/i, /reorganize/i, /rename/i] },
  { category: "code_review", patterns: [/review/i, /feedback on/i, /improve this code/i] },
  { category: "security_audit", patterns: [/security/i, /vulnerabilit/i, /xss/i, /injection/i] },
  { category: "test_generation", patterns: [/test/i, /unit test/i, /coverage/i, /spec/i] },
  { category: "documentation", patterns: [/document/i, /readme/i, /jsdoc/i, /comment/i] },
  { category: "autocomplete", patterns: [/complete/i, /suggest/i, /autocomplete/i] },
  { category: "data_analysis", patterns: [/analyze data/i, /chart/i, /sql/i, /query/i] },
  { category: "vision", patterns: [/screenshot/i, /image/i, /ui design/i, /mockup/i] },
  { category: "code_generation", patterns: [/write code/i, /implement/i, /create function/i, /build/i] },
  { category: "chat", patterns: [/explain/i, /what is/i, /how does/i, /tell me/i] },
];

/** Classify user input into task category and complexity */
export function analyzeTask(userInput: string, context?: {
  fileCount?: number;
  hasOpenFiles?: boolean;
  isInlineEdit?: boolean;
}): TaskAnalysis {
  const input = userInput.toLowerCase().trim();
  const wordCount = input.split(/\s+/).length;

  let category: TaskCategory = "chat";
  for (const { category: cat, patterns } of CATEGORY_PATTERNS) {
    if (patterns.some((p) => p.test(userInput))) {
      category = cat;
      break;
    }
  }

  if (context?.isInlineEdit) category = "autocomplete";
  if (context?.fileCount && context.fileCount > 3) category = "agentic_coding";

  let complexity: TaskAnalysis["complexity"] = "moderate";
  if (wordCount < 8 || COMPLEXITY_KEYWORDS.trivial.some((k) => input.includes(k))) {
    complexity = "trivial";
  } else if (COMPLEXITY_KEYWORDS.simple.some((k) => input.includes(k)) || wordCount < 20) {
    complexity = "simple";
  } else if (COMPLEXITY_KEYWORDS.expert.some((k) => input.includes(k)) || wordCount > 100) {
    complexity = "expert";
  } else if (COMPLEXITY_KEYWORDS.complex.some((k) => input.includes(k)) || wordCount > 50) {
    complexity = "complex";
  }

  const tokenEstimates: Record<TaskAnalysis["complexity"], { in: number; out: number }> = {
    trivial: { in: 500, out: 200 },
    simple: { in: 1500, out: 800 },
    moderate: { in: 4000, out: 2000 },
    complex: { in: 12000, out: 6000 },
    expert: { in: 30000, out: 15000 },
  };

  const est = tokenEstimates[complexity];

  return {
    category,
    complexity,
    estimatedInputTokens: est.in + (context?.fileCount ?? 0) * 2000,
    estimatedOutputTokens: est.out,
    requiresTools: ["agentic_coding", "code_generation", "refactoring", "debugging"].includes(category),
    requiresVision: category === "vision",
    urgency: context?.isInlineEdit ? "instant" : complexity === "trivial" ? "instant" : "normal",
    confidence: 0.85,
  };
}

/** Minimum capability thresholds per complexity level */
const COMPLEXITY_REQUIREMENTS: Record<
  TaskAnalysis["complexity"],
  { minCoding: number; minReasoning: number; minSpeed: number }
> = {
  trivial: { minCoding: 50, minReasoning: 50, minSpeed: 80 },
  simple: { minCoding: 65, minReasoning: 60, minSpeed: 70 },
  moderate: { minCoding: 75, minReasoning: 75, minSpeed: 60 },
  complex: { minCoding: 82, minReasoning: 85, minSpeed: 50 },
  expert: { minCoding: 88, minReasoning: 90, minSpeed: 40 },
};

function scoreModel(
  model: AIModel,
  analysis: TaskAnalysis,
  config: RouterConfig
): number {
  const reqs = COMPLEXITY_REQUIREMENTS[analysis.complexity];
  const caps = model.capabilities;

  if (caps.coding < reqs.minCoding) return -1;
  if (caps.reasoning < reqs.minReasoning) return -1;
  if (analysis.urgency === "instant" && caps.speed < reqs.minSpeed) return -1;
  if (analysis.requiresTools && !caps.supportsTools) return -1;
  if (analysis.requiresVision && !caps.supportsVision) return -1;
  if (!config.availableProviders.includes(model.provider) && model.requiresUserKey) return -1;

  let score = 0;

  // Task-category fit (0-30)
  if (model.strengths.includes(analysis.category)) score += 30;
  else if (model.strengths.some((s) => s === "code_generation")) score += 15;

  // Quality fit (0-25)
  const qualityTarget = config.qualityMode === 2 ? 95 : config.qualityMode === 1 ? 80 : 65;
  const qualityDelta = Math.abs(caps.coding - qualityTarget);
  score += Math.max(0, 25 - qualityDelta * 0.5);

  // Cost efficiency / profit margin (0-25)
  const cost = estimateCost(model, analysis.estimatedInputTokens, analysis.estimatedOutputTokens);
  const marginMultiplier = model.timegroundMargin;
  score += Math.min(25, marginMultiplier * 15);
  if (cost < 0.01) score += 10;
  else if (cost < 0.05) score += 5;

  // Speed bonus for instant tasks (0-10)
  if (analysis.urgency === "instant") score += caps.speed * 0.1;

  // Local preference bonus
  if (config.preferLocal && model.tier === "open_source") score += 15;

  // Penalize overkill (using frontier for trivial tasks)
  if (analysis.complexity === "trivial" && model.tier === "frontier") score -= 40;
  if (analysis.complexity === "simple" && model.tier === "frontier") score -= 25;

  // Quality mode adjustments
  if (config.qualityMode === 2) {
    score += caps.coding * 0.2 + caps.reasoning * 0.1;
  } else if (config.qualityMode === 0) {
    score += (100 - cost * 1000) * 0.3;
  }

  return score;
}

/** Core routing algorithm — selects optimal model for quality + profit */
export function routeTask(
  userInput: string,
  config: RouterConfig,
  context?: Parameters<typeof analyzeTask>[1]
): RoutingDecision {
  const analysis = analyzeTask(userInput, context);

  const candidates = MODEL_CATALOG.filter((model) => {
    if (model.requiresUserKey && !config.availableProviders.includes(model.provider)) {
      if (model.tier !== "open_source") return false;
    }
    if (config.preferLocal && model.tier === "open_source") return true;
    return true;
  });

  const scored = candidates
    .map((model) => ({ model, score: scoreModel(model, analysis, config) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    const fallback = MODEL_CATALOG.find((m) => m.id === "deepseek-v4-flash")!;
    return buildDecision(fallback, analysis, config, scored.map((s) => s.model));
  }

  const best = scored[0].model;
  const fallbacks = scored.slice(1, 4).map((s) => s.model);

  return buildDecision(best, analysis, config, fallbacks);
}

function buildDecision(
  model: AIModel,
  analysis: TaskAnalysis,
  config: RouterConfig,
  fallbacks: AIModel[]
): RoutingDecision {
  const estimatedCostUsd = estimateCost(
    model,
    analysis.estimatedInputTokens,
    analysis.estimatedOutputTokens
  );
  const rawCost = estimatedCostUsd / model.timegroundMargin;
  const estimatedMarginUsd = estimatedCostUsd - rawCost;

  const reasoning = buildReasoning(model, analysis, config);

  return {
    model,
    analysis,
    estimatedCostUsd,
    estimatedMarginUsd,
    reasoning,
    fallbacks,
    score: scoreModel(model, analysis, config),
  };
}

function buildReasoning(
  model: AIModel,
  analysis: TaskAnalysis,
  config: RouterConfig
): string {
  const parts: string[] = [];

  parts.push(`Detected a ${analysis.complexity} ${analysis.category.replace(/_/g, " ")} task.`);

  if (model.tier === "open_source") {
    parts.push(`Routing to ${model.name} locally — zero API cost, full privacy.`);
  } else if (analysis.complexity === "expert" || analysis.complexity === "complex") {
    parts.push(`${model.name} gives you top-tier quality where it matters most.`);
  } else if (analysis.complexity === "trivial" || analysis.complexity === "simple") {
    parts.push(`Using ${model.name} — fast, capable, and cost-smart for this kind of ask.`);
  } else {
    parts.push(`${model.name} hits the sweet spot of quality and value for this task.`);
  }

  if (config.qualityMode === 2) {
    parts.push("Quality mode is maxed — I picked the strongest model available to you.");
  }

  return parts.join(" ");
}

/** Quick classify for inline autocomplete — always pick fastest cheap model */
export function routeAutocomplete(config: RouterConfig): AIModel {
  const fast = MODEL_CATALOG.filter(
    (m) =>
      m.capabilities.speed >= 90 &&
      m.strengths.includes("autocomplete") &&
      (config.availableProviders.includes(m.provider) || m.tier === "open_source")
  ).sort((a, b) => a.pricing.inputPer1M - b.pricing.inputPer1M);

  return fast[0] ?? MODEL_CATALOG.find((m) => m.id === "deepseek-v4-flash")!;
}

export { analyzeTask as classifyTask };

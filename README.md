# TimeGround Code

**The AI-native code editor by [TimeGround LLP](https://timeground.in)**

TimeGround Code intelligently routes every coding task to the optimal AI model — maximizing quality for you and efficiency for the business. Built on Monaco (same editor core as VS Code) with Electron, designed to evolve into a full VS Code fork.

## Why TimeGround Code beats one-model editors

| Feature | Cursor | TimeGround Code |
|---------|--------|----------------|
| Model selection | Fixed per plan | **Smart router picks best model per task** |
| Cost control | Opaque | **Transparent routing + margin-aware algorithm** |
| Provider lock-in | Single vendor | **30+ models, 18 providers, local Ollama** |
| Personality | Generic | **Ground — warm, clear, encouraging** |
| Open source path | Limited | **Full local models via Ollama** |

## Quick Start

```bash
# Prerequisites: Node.js 20+, pnpm 9+

pnpm install
pnpm dev
```

Add your API keys via **Settings** (gear icon). Start with Anthropic, OpenAI, or Google — Ground routes automatically.

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+L` | Toggle AI chat |
| `Ctrl+S` | Save file |

## Architecture

```
timeground-ide/
├── apps/timeground-ide/     # Electron desktop app (Monaco + React)
├── packages/
│   ├── model-registry/      # 30+ AI models, pricing, capabilities
│   ├── ai-router/           # Smart routing algorithm
│   └── agent-core/          # Ground agent + LLM adapters
```

## License

MIT © TimeGround LLP

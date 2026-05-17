import { OpenAIProvider } from "../providers/openai";
import { AnthropicProvider } from "../providers/anthropic";
import { OpenRouterProvider } from "../providers/openrouter";
import { GoogleProvider } from "../providers/google";
import { HackClubProvider } from "../providers/hackclub";
import { WhiskerProvider } from "../providers/whisker";
import { GroqProvider } from "../providers/groq";
import { Provider, ProviderConfig } from "../types";
import { ZenProvider } from "../providers/zen";

export function createProvider(config: ProviderConfig): Provider {
  switch (config.provider) {
    case "openai":
      return new OpenAIProvider(config);
    case "anthropic":
      return new AnthropicProvider(config);
    case "openrouter":
      return new OpenRouterProvider(config);
    case "google":
      return new GoogleProvider(config);
    case "hackclub":
      return new HackClubProvider(config);
    case "groq":
      return new GroqProvider(config);
    case "whisker":
      return new WhiskerProvider(config);
    case "opencode-zen":
      return new ZenProvider(config);
    default:
      throw new Error("Unsupported provider");
  }
}

import { ModelMessage } from "ai";

export type ProviderType =
  | "openai"
  | "anthropic"
  | "openrouter"
  | "google"
  | "hackclub"
  | "groq"
  | "whisker"
  | "opencode-zen";

export type ProviderConfig = {
  provider: ProviderType;
  apiKey?: string;
  baseURL?: string;
};

export type ChatOptions = {
  model: string;
  messages?: ModelMessage[];
  prompt: string;
  system?: string;
};

export type StreamOptions = {
  model: string;
  messages?: any[];
  prompt: string;
  system?: string;
};

export abstract class Provider {
  constructor(public config: ProviderConfig) {}

  abstract chat({
    model,
    prompt,
    messages,
    system,
  }: ChatOptions): Promise<string>;

  abstract stream({
    model,
    prompt,
    messages,
    system,
  }: StreamOptions): Promise<ReadableStream>;
}

export type ProviderType =
  | "openai"
  | "anthropic"
  | "openrouter"
  | "google"
  | "hackclub"
  | "groq"
  | "whisker";

export type ProviderConfig = {
  provider: ProviderType;
  apiKey?: string;
  baseURL?: string;
};

export type ChatOptions = {
  model: string;
  messages?: any[];
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
  constructor(private config: ProviderConfig) {}

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

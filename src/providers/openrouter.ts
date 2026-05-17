import { generateText, streamText } from "ai";
import { ChatOptions, Provider, ProviderConfig, StreamOptions } from "../types";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export class OpenRouterProvider extends Provider {
  constructor(config: ProviderConfig) {
    super(config);
  }

  async chat({
    model,
    prompt,
    messages,
    system,
  }: ChatOptions): Promise<string> {
    const client = createOpenRouter({
      // baseURL: "https://api.groq.com/openai/v1",
      apiKey: this.config.apiKey,
    })(model);

    const { text } = await generateText({
      model: client,
      system,
      ...(messages && messages.length > 0 ? { messages } : { prompt }),
    });

    return text;
  }

  async stream({
    model,
    prompt,
    messages,
    system,
  }: StreamOptions): Promise<ReadableStream> {
    const client = createOpenRouter({
      // baseURL: "https://api.groq.com/openai/v1",
      apiKey: this.config.apiKey,
    })(model);

    const { textStream } = streamText({
      model: client,
      system,
      ...(messages && messages.length > 0 ? { messages } : { prompt }),
    });

    return textStream.pipeThrough(new TextEncoderStream());
  }
}

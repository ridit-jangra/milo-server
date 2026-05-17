import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { ChatOptions, Provider, ProviderConfig, StreamOptions } from "../types";
import { generateText, streamText } from "ai";

export class HackClubProvider extends Provider {
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
      baseURL: "https://ai.hackclub.com/proxy/v1/chat/completions",
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
      baseURL: "https://ai.hackclub.com/proxy/v1/chat/completions",
      apiKey: this.config.apiKey,
    })(model);

    const { textStream } = streamText({
      model: client,
      system,
      ...(messages && messages.length > 0 ? { messages } : { prompt }),
    });

    return textStream;
  }
}

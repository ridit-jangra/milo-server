import { generateText, streamText } from "ai";
import { ChatOptions, Provider, ProviderConfig, StreamOptions } from "../types";
import { createAnthropic } from "@ai-sdk/anthropic";

export class AnthropicProvider extends Provider {
  constructor(config: ProviderConfig) {
    super(config);
  }

  async chat({
    model,
    prompt,
    messages,
    system,
  }: ChatOptions): Promise<string> {
    const client = createAnthropic({
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
    const client = createAnthropic({
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

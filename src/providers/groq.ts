import { createGroq } from "@ai-sdk/groq";
import { ChatOptions, Provider, ProviderConfig, StreamOptions } from "../types";
import { generateText, streamText } from "ai";

export class GroqProvider extends Provider {
  constructor(config: ProviderConfig) {
    super(config);
  }

  async chat({
    model,
    prompt,
    messages,
    system,
  }: ChatOptions): Promise<string> {
    const client = createGroq({
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
    const client = createGroq({
      // baseURL: "https://api.groq.com/openai/v1",
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

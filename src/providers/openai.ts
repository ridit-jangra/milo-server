import { createOpenAI } from "@ai-sdk/openai";
import { ChatOptions, Provider, ProviderConfig, StreamOptions } from "../types";
import { generateText, streamText } from "ai";

export class OpenAIProvider extends Provider {
  constructor(config: ProviderConfig) {
    super(config);
  }

  async chat({
    model,
    prompt,
    messages,
    system,
  }: ChatOptions): Promise<string> {
    const client = createOpenAI({
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
    const client = createOpenAI({
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

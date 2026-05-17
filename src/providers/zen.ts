import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { ChatOptions, Provider, ProviderConfig, StreamOptions } from "../types";
import { generateText, streamText } from "ai";

export class ZenProvider extends Provider {
  constructor(config: ProviderConfig) {
    super(config);
  }

  async chat({
    model,
    prompt,
    messages,
    system,
  }: ChatOptions): Promise<string> {
    const client = createOpenAICompatible({
      name: "zen",
      baseURL: "https://opencode.ai/zen/v1",
      headers: { Authorization: `Bearer ${this.config.apiKey}` },
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
    const client = createOpenAICompatible({
      name: "zen",
      baseURL: "https://opencode.ai/zen/v1",
      headers: { Authorization: `Bearer ${this.config.apiKey}` },
    })(model);

    const { textStream } = streamText({
      model: client,
      system,
      ...(messages && messages.length > 0 ? { messages } : { prompt }),
    });

    return textStream.pipeThrough(new TextEncoderStream());
  }
}

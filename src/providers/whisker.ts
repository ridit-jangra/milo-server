import { ChatOptions, Provider, ProviderConfig, StreamOptions } from "../types";

export class WhiskerProvider extends Provider {
  constructor(config: ProviderConfig) {
    super(config);
  }

  async chat({
    model,
    prompt,
    messages,
    system,
  }: ChatOptions): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async stream({
    model,
    prompt,
    messages,
    system,
  }: StreamOptions): Promise<ReadableStream> {
    throw new Error("Method not implemented.");
  }
}

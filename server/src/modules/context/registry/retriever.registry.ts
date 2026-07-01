import { Injectable, Logger } from '@nestjs/common';
import { Retriever, RetrieverMetadata } from '../interfaces/retriever.interface';
import { ContextSource } from '../types/context-source.type';
import { DEFAULT_RETRIEVER_TIMEOUT_MS, MAX_RETRIEVER_TIMEOUT_MS } from '../constants';

export interface RegisteredRetriever {
  retriever: Retriever;
  metadata: RetrieverMetadata;
  timeoutMs: number;
}

@Injectable()
export class RetrieverRegistry {
  private readonly logger = new Logger(RetrieverRegistry.name);
  private readonly retrievers = new Map<string, RegisteredRetriever>();
  private readonly timeoutOverrides = new Map<string, number>();

  register(retriever: Retriever, timeoutMs?: number): void {
    const source = retriever.source;
    if (this.retrievers.has(source)) {
      this.logger.warn(`Retriever for source "${source}" is being overwritten`);
    }

    const timeout = timeoutMs ?? DEFAULT_RETRIEVER_TIMEOUT_MS;
    const clampedTimeout = Math.min(Math.max(timeout, 0), MAX_RETRIEVER_TIMEOUT_MS);

    this.retrievers.set(source, {
      retriever,
      metadata: { ...retriever.metadata },
      timeoutMs: clampedTimeout,
    });

    this.logger.log(
      `Registered retriever "${retriever.metadata.name}" for source: "${source}" (priority: ${retriever.metadata.priority}, timeout: ${clampedTimeout}ms)`
    );
  }

  unregister(source: string): boolean {
    const removed = this.retrievers.delete(source);
    this.timeoutOverrides.delete(source);
    if (removed) {
      this.logger.log(`Unregistered retriever for source: "${source}"`);
    }
    return removed;
  }

  enable(source: string): void {
    const entry = this.retrievers.get(source);
    if (entry) {
      entry.metadata.enabled = true;
      this.retrievers.set(source, entry);
      this.logger.log(`Enabled retriever for source: "${source}"`);
    }
  }

  disable(source: string): void {
    const entry = this.retrievers.get(source);
    if (entry) {
      entry.metadata.enabled = false;
      this.retrievers.set(source, entry);
      this.logger.log(`Disabled retriever for source: "${source}"`);
    }
  }

  priority(source: string): number | undefined {
    const entry = this.retrievers.get(source);
    return entry?.metadata.priority;
  }

  setTimeout(source: string, timeoutMs: number): void {
    const clampedTimeout = Math.min(Math.max(timeoutMs, 0), MAX_RETRIEVER_TIMEOUT_MS);
    this.timeoutOverrides.set(source, clampedTimeout);
    this.logger.log(`Set timeout for "${source}" to ${clampedTimeout}ms`);
  }

  getTimeout(source: string): number {
    const entry = this.retrievers.get(source);
    if (!entry) return DEFAULT_RETRIEVER_TIMEOUT_MS;
    return this.timeoutOverrides.get(source) ?? entry.timeoutMs;
  }

  getRetriever(source: ContextSource): Retriever | undefined {
    return this.retrievers.get(source)?.retriever;
  }

  list(): RegisteredRetriever[] {
    return Array.from(this.retrievers.values());
  }

  metadata(source: string): RetrieverMetadata | undefined {
    return this.retrievers.get(source)?.metadata;
  }

  hasRetriever(source: string): boolean {
    return this.retrievers.has(source);
  }

  getRegisteredSources(): string[] {
    return Array.from(this.retrievers.keys());
  }

  clear(): void {
    this.retrievers.clear();
    this.timeoutOverrides.clear();
  }
}

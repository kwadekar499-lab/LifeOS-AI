import { Injectable, Logger } from '@nestjs/common';

export interface TokenGeneratorConfig {
  minDelay: number;
  maxDelay: number;
}

@Injectable()
export class MockTokenGeneratorService {
  private readonly logger = new Logger(MockTokenGeneratorService.name);
  private readonly config: TokenGeneratorConfig;

  constructor(config: TokenGeneratorConfig = { minDelay: 30, maxDelay: 80 }) {
    this.config = config;
  }

  async *generateTokens(text: string): AsyncGenerator<string, void, unknown> {
    const words = text.split(' ');
    this.logger.debug(`Generating ${words.length} tokens`);

    for (const word of words) {
      const delay = this.getRandomDelay();
      await this.sleep(delay);
      yield word + ' ';
    }
  }

  private getRandomDelay(): number {
    return Math.floor(Math.random() * (this.config.maxDelay - this.config.minDelay + 1)) + this.config.minDelay;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

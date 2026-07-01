import { Module, Global } from '@nestjs/common';
import { PromptBuilderService } from './services/prompt-builder.service';
import { PromptBuilder } from './builders/prompt-builder';

@Global()
@Module({
  providers: [PromptBuilderService, PromptBuilder],
  exports: [PromptBuilderService, PromptBuilder],
})
export class PromptModule {}

import { Module } from '@nestjs/common';
import { AssistantController } from './controllers/assistant.controller';
import { AssistantOrchestratorService } from './orchestrator/services/assistant-orchestrator.service';
import { IntentClassifier } from './orchestrator/services/intent-classifier.service';
import { StreamEventEmitter } from './services/stream-event.emitter';
import { StreamMetricsService } from './services/stream-metrics.service';
import { ContextModule } from '../context/context.module';
import { PromptModule } from '../prompt/prompt.module';
import { AiModule } from '../ai/ai.module';
import { ConversationsModule } from '../conversations/conversations.module';

@Module({
  imports: [ContextModule, PromptModule, AiModule, ConversationsModule],
  controllers: [AssistantController],
  providers: [AssistantOrchestratorService, IntentClassifier, StreamEventEmitter, StreamMetricsService],
  exports: [AssistantOrchestratorService],
})
export class AssistantModule {}

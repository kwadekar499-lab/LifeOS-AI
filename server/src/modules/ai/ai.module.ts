import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { AiGatewayController } from './controllers/ai-gateway.controller';
import { AiGatewayService } from './services/ai-gateway.service';
import { ProviderRegistry } from './registry/provider-registry';
import { MockProvider } from './providers/mock.provider';
import { AI_GATEWAY_CONFIG, loadAiGatewayConfig } from './config/ai-config';

@Module({
  controllers: [AiGatewayController],
  providers: [
    {
      provide: AI_GATEWAY_CONFIG,
      useFactory: () => loadAiGatewayConfig(),
    },
    ProviderRegistry,
    MockProvider,
    AiGatewayService,
  ],
  exports: [AiGatewayService, ProviderRegistry],
})
export class AiModule implements OnModuleInit {
  private readonly logger = new Logger(AiModule.name);

  constructor(
    private readonly registry: ProviderRegistry,
    private readonly mockProvider: MockProvider
  ) {}

  onModuleInit(): void {
    this.registry.registerProvider(this.mockProvider);
    this.logger.log('AI Gateway module initialized with MockProvider');
    this.logger.log(`Providers registered: ${this.registry.listProviderNames().join(', ')}`);
  }
}

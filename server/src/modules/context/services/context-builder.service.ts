import { Injectable, Logger } from '@nestjs/common';
import { ContextBuilder } from '../builders/context-builder';
import { ContextRequest } from '../types/context-request.type';
import { ContextObject } from '../types/context-object.type';
import { BuildContextDto } from '../dto/build-context.dto';

@Injectable()
export class ContextBuilderService {
  private readonly logger = new Logger(ContextBuilderService.name);

  constructor(private readonly contextBuilder: ContextBuilder) {}

  async buildContext(dto: BuildContextDto): Promise<ContextObject> {
    const request: ContextRequest = {
      requestId: dto.requestId,
      conversationId: dto.conversationId,
      userId: dto.userId,
      query: dto.query,
      tokenBudget: dto.tokenBudget,
      includeSources: dto.includeSources,
      excludeSources: dto.excludeSources,
    };

    const context = await this.contextBuilder.build(request);

    this.logger.log(
      {
        requestId: dto.requestId,
        conversationId: dto.conversationId,
        itemsRetrieved: context.metadata.itemsRetrieved,
        itemsIncluded: context.metadata.itemsIncluded,
        estimatedTokens: context.metadata.estimatedTokens,
      },
      'ContextBuilderService: context built successfully'
    );

    return context;
  }
}

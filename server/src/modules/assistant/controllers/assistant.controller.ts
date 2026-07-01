import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ChatRequestDto } from '../dto/chat-request.dto';
import { AssistantOrchestratorService } from '../orchestrator/services/assistant-orchestrator.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('api/v1/assistant')
export class AssistantController {
  constructor(private readonly orchestrator: AssistantOrchestratorService) {}

  @Post('chat')
  @UseGuards(JwtAuthGuard)
  async chat(@CurrentUser() user: { sub: string }, @Body() chatRequest: ChatRequestDto) {
    const requestId = uuidv4();

    const response = await this.orchestrator.processRequest({
      requestId,
      userId: user.sub,
      conversationId: chatRequest.conversationId,
      message: chatRequest.message,
      provider: chatRequest.provider,
      model: chatRequest.model,
      stream: false,
    });

    return {
      success: true,
      data: response,
    };
  }

  @Post('chat/stream')
  @UseGuards(JwtAuthGuard)
  async chatStream(@CurrentUser() user: { sub: string }, @Body() chatRequest: ChatRequestDto) {
    const requestId = uuidv4();

    const response = await this.orchestrator.processStreamingRequest({
      requestId,
      userId: user.sub,
      conversationId: chatRequest.conversationId,
      message: chatRequest.message,
      provider: chatRequest.provider,
      model: chatRequest.model,
      stream: true,
    });

    return {
      success: true,
      data: response,
    };
  }
}

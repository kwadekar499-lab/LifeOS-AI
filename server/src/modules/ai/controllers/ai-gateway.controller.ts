import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus, Req, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AiGatewayService } from '../services/ai-gateway.service';
import { AiRequestDto } from '../dto/ai-request.dto';
import { StreamChunkDto } from '../dto/stream-chunk.dto';
import { AiResponseDto } from '../dto/ai-response.dto';

interface RequestWithResponse {
  res: {
    setHeader: (key: string, value: string) => void;
    write: (chunk: string) => void;
    end: () => void;
  };
}

@Controller('api/v1/ai')
@UseGuards(JwtAuthGuard)
export class AiGatewayController {
  private readonly logger = new Logger(AiGatewayController.name);

  constructor(private readonly aiGatewayService: AiGatewayService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generate(@CurrentUser() user: { sub: string }, @Body() request: AiRequestDto): Promise<AiResponseDto> {
    this.logger.log({
      message: 'AI Gateway generate endpoint called',
      userId: user.sub,
      provider: request.provider,
    });

    request.requestId = request.requestId || `gen-${user.sub}-${Date.now()}`;
    return this.aiGatewayService.generate(request);
  }

  @Post('stream')
  @HttpCode(HttpStatus.OK)
  async stream(
    @CurrentUser() user: { sub: string },
    @Body() request: AiRequestDto,
    @Req() req: RequestWithResponse
  ): Promise<void> {
    const requestId = `stream-${user.sub}-${Date.now()}`;
    request.requestId = requestId;

    this.logger.log({
      message: 'AI Gateway stream endpoint called',
      userId: user.sub,
      provider: request.provider,
      requestId,
    });

    req.res.setHeader('Content-Type', 'text/event-stream');
    req.res.setHeader('Cache-Control', 'no-cache');
    req.res.setHeader('Connection', 'keep-alive');
    req.res.setHeader('X-Request-Id', requestId);

    await this.aiGatewayService.stream(
      request,
      (chunk: StreamChunkDto) => {
        const sseData = `data: ${JSON.stringify(chunk)}\n\n`;
        req.res.write(sseData);
      },
      (response: AiResponseDto) => {
        req.res.write(`data: ${JSON.stringify(response)}\n\n`);
        req.res.write('data: [DONE]\n\n');
        req.res.end();
      },
      (error: Error) => {
        req.res.write(`data: ${JSON.stringify({ error: error.message, requestId })}\n\n`);
        req.res.write('data: [ERROR]\n\n');
        req.res.end();
      }
    );
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  async health(): Promise<{
    status: string;
    providers: string[];
    defaultProvider: string;
    details: unknown;
  }> {
    const healthDetails = await this.aiGatewayService.health();
    return {
      status: 'operational',
      providers: this.aiGatewayService.listProviders(),
      defaultProvider: this.aiGatewayService.getDefaultProvider(),
      details: healthDetails,
    };
  }

  @Get('providers')
  @HttpCode(HttpStatus.OK)
  listProviders(): { providers: string[]; defaultProvider: string } {
    return {
      providers: this.aiGatewayService.listProviders(),
      defaultProvider: this.aiGatewayService.getDefaultProvider(),
    };
  }
}

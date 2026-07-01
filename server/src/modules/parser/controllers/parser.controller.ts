import { Controller, Post, Get, Delete, Param, UseGuards, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ParserService } from '../services/parser.service';

@ApiTags('parser')
@Controller('parser')
@UseGuards(JwtAuthGuard)
export class ParserController {
  private readonly logger = new Logger(ParserController.name);

  constructor(private readonly parserService: ParserService) {}

  @Post(':fileId/parse')
  @ApiOperation({ summary: 'Parse a file' })
  async parse(@CurrentUser() user: any, @Param('fileId') fileId: string, @Body() body: { requestId?: string }) {
    const result = await this.parserService.parseDocument(fileId, user.userId, body.requestId);
    return { success: true, data: result };
  }

  @Get(':fileId/document')
  @ApiOperation({ summary: 'Get parsed document' })
  async getDocument(@CurrentUser() user: any, @Param('fileId') fileId: string) {
    const document = await this.parserService.getDocument(fileId, user.userId);
    return { success: true, data: document };
  }

  @Get(':fileId/chunks')
  @ApiOperation({ summary: 'Get document chunks' })
  async getChunks(@CurrentUser() user: any, @Param('fileId') fileId: string) {
    const chunks = await this.parserService.getChunks(fileId, user.userId);
    return { success: true, data: chunks };
  }

  @Delete(':fileId')
  @ApiOperation({ summary: 'Delete parsed document' })
  async deleteDocument(@CurrentUser() user: any, @Param('fileId') fileId: string) {
    const result = await this.parserService.deleteDocument(fileId, user.userId);
    return { success: true, data: result };
  }

  @Get('supported')
  @ApiOperation({ summary: 'Get supported parsers' })
  getSupportedParsers() {
    return { success: true, data: this.parserService.getSupportedParsers() };
  }
}

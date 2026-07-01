import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { MessageService } from '../services/message.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageStatusDto } from '../dto/update-message-status.dto';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('conversations/:conversationId/messages')
  @ApiOperation({ summary: 'Create a message in a conversation' })
  @ApiResponse({ status: 201, description: 'Message created successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @CurrentUser() userId: string,
    @Param('conversationId') conversationId: string,
    @Body() dto: CreateMessageDto
  ) {
    return this.messageService.create(conversationId, userId, dto);
  }

  @Get('conversations/:conversationId/messages')
  @ApiOperation({ summary: 'List messages in a conversation with cursor-based pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Results per page' })
  @ApiQuery({ name: 'cursor', required: false, type: String, description: 'Pagination cursor' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @CurrentUser() userId: string,
    @Param('conversationId') conversationId: string,
    @Query('limit') limit?: number,
    @Query('cursor') cursor?: string
  ) {
    return this.messageService.findAll(conversationId, userId, { limit, cursor });
  }

  @Patch('messages/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update message status (for streaming updates)' })
  @ApiResponse({ status: 200, description: 'Message status updated' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your message' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateStatus(@CurrentUser() userId: string, @Param('id') id: string, @Body() dto: UpdateMessageStatusDto) {
    return this.messageService.updateStatus(id, userId, dto);
  }

  @Delete('messages/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a message' })
  @ApiResponse({ status: 200, description: 'Message soft deleted' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your message' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async softDelete(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.messageService.softDelete(id, userId);
  }
}

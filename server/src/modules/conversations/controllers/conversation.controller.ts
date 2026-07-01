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
import { ConversationService } from '../services/conversation.service';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { UpdateConversationDto } from '../dto/update-conversation.dto';
import { SearchConversationsDto } from '../dto/search-conversations.dto';

@ApiTags('Conversations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiResponse({ status: 201, description: 'Conversation created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@CurrentUser() userId: string, @Body() dto: CreateConversationDto) {
    return this.conversationService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List conversations with cursor-based pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Results per page' })
  @ApiQuery({ name: 'cursor', required: false, type: String, description: 'Pagination cursor' })
  @ApiResponse({ status: 200, description: 'Conversations retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@CurrentUser() userId: string, @Query('limit') limit?: number, @Query('cursor') cursor?: string) {
    return this.conversationService.findAll(userId, { limit, cursor });
  }

  @Get('search')
  @ApiOperation({ summary: 'Search conversations by title, summary, or last message' })
  @ApiResponse({ status: 200, description: 'Search results retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async search(@CurrentUser() userId: string, @Query() dto: SearchConversationsDto) {
    return this.conversationService.search(userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a conversation by ID' })
  @ApiResponse({ status: 200, description: 'Conversation retrieved' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async findById(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.conversationService.findById(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update conversation (rename)' })
  @ApiResponse({ status: 200, description: 'Conversation updated' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async update(@CurrentUser() userId: string, @Param('id') id: string, @Body() dto: UpdateConversationDto) {
    return this.conversationService.update(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a conversation' })
  @ApiResponse({ status: 200, description: 'Conversation soft deleted' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async softDelete(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.conversationService.softDelete(id, userId);
  }

  @Post(':id/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive a conversation' })
  @ApiResponse({ status: 200, description: 'Conversation archived' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async archive(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.conversationService.archive(id, userId);
  }

  @Post(':id/pin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pin a conversation' })
  @ApiResponse({ status: 200, description: 'Conversation pinned' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async pin(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.conversationService.pin(id, userId);
  }

  @Delete(':id/pin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unpin a conversation' })
  @ApiResponse({ status: 200, description: 'Conversation unpinned' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async unpin(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.conversationService.unpin(id, userId);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore a soft deleted conversation' })
  @ApiResponse({ status: 200, description: 'Conversation restored' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async restore(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.conversationService.restore(id, userId);
  }
}

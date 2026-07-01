import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { KnowledgeService } from '../services/knowledge.service';
import { CreateKnowledgeDto, UpdateKnowledgeDto } from '../dto';

@ApiTags('knowledge')
@Controller('knowledge')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post()
  @ApiOperation({ summary: 'Create knowledge entry' })
  @ApiResponse({ status: 201, description: 'Knowledge created successfully' })
  create(@CurrentUser() user: any, @Body() dto: CreateKnowledgeDto) {
    return this.knowledgeService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all knowledge entries' })
  @ApiResponse({ status: 200, description: 'Knowledge entries retrieved' })
  findAll(
    @CurrentUser() user: any,
    @Query('category') category?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number
  ) {
    return this.knowledgeService.list(user.id, category, cursor, limit);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search knowledge entries' })
  @ApiResponse({ status: 200, description: 'Search results' })
  search(
    @CurrentUser() user: any,
    @Query('q') q: string,
    @Query('category') category?: string,
    @Query('tags') tags?: string[],
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number
  ) {
    return this.knowledgeService.search(user.id, q, category, tags, cursor, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get knowledge by ID' })
  @ApiResponse({ status: 200, description: 'Knowledge entry found' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.knowledgeService.findById(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update knowledge entry' })
  @ApiResponse({ status: 200, description: 'Knowledge updated successfully' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateKnowledgeDto) {
    return this.knowledgeService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete knowledge entry (soft delete)' })
  @ApiResponse({ status: 200, description: 'Knowledge deleted successfully' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.knowledgeService.softDelete(id, user.id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore deleted knowledge entry' })
  @ApiResponse({ status: 200, description: 'Knowledge restored successfully' })
  restore(@CurrentUser() user: any, @Param('id') id: string) {
    return this.knowledgeService.restore(id, user.id);
  }
}

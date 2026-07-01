import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JournalService } from '../services/journal.service';
import { CreateJournalDto } from '../dto';
import { UpdateJournalDto } from '../dto';

@ApiTags('journal')
@Controller('journal')
@UseGuards(JwtAuthGuard)
export class JournalController {
  private readonly logger = new Logger(JournalController.name);

  constructor(private readonly journalService: JournalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new journal entry' })
  async create(@CurrentUser() user: { userId: string }, @Body() dto: CreateJournalDto) {
    const entry = await this.journalService.create(user.userId, dto);
    this.logger.log({ userId: user.userId, journalId: entry.id, action: 'journal_controller_create' });
    return entry;
  }

  @Get()
  @ApiOperation({ summary: 'List journal entries' })
  async list(
    @CurrentUser() user: { userId: string },
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string
  ) {
    const result = await this.journalService.list(user.userId, cursor, limit ? parseInt(limit) : undefined);
    return result;
  }

  @Get('search')
  @ApiOperation({ summary: 'Search journal entries' })
  async search(
    @CurrentUser() user: { userId: string },
    @Query('query') query: string,
    @Query('tags') tags?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string
  ) {
    const tagList = tags ? tags.split(',') : undefined;
    const result = await this.journalService.search(
      user.userId,
      query,
      tagList,
      cursor,
      limit ? parseInt(limit) : undefined
    );
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get journal entry by ID' })
  async findById(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    const entry = await this.journalService.findById(id, user.userId);
    return entry;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update journal entry' })
  async update(@CurrentUser() user: { userId: string }, @Param('id') id: string, @Body() dto: UpdateJournalDto) {
    const entry = await this.journalService.update(id, user.userId, dto);
    this.logger.log({ userId: user.userId, journalId: entry.id, action: 'journal_controller_update' });
    return entry;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete journal entry' })
  async delete(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    const entry = await this.journalService.softDelete(id, user.userId);
    this.logger.log({ userId: user.userId, journalId: entry.id, action: 'journal_controller_delete' });
    return entry;
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore deleted journal entry' })
  async restore(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    const entry = await this.journalService.restore(id, user.userId);
    this.logger.log({ userId: user.userId, journalId: entry.id, action: 'journal_controller_restore' });
    return entry;
  }

  @Get('date/:date')
  @ApiOperation({ summary: 'Get journal entries by date' })
  async findByDate(@CurrentUser() user: { userId: string }, @Param('date') date: string) {
    const entries = await this.journalService.findByDate(user.userId, new Date(date));
    return entries;
  }

  @Get('range')
  @ApiOperation({ summary: 'Get journal entries by date range' })
  async findRange(@CurrentUser() user: { userId: string }, @Query('start') start: string, @Query('end') end: string) {
    const entries = await this.journalService.findRange(user.userId, new Date(start), new Date(end));
    return entries;
  }
}

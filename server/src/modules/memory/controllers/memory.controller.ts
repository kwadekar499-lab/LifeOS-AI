import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MemoryService } from '../services/memory.service';
import { CreateMemoryDto } from '../dto/create-memory.dto';
import { UpdateMemoryDto } from '../dto/update-memory.dto';
import { SearchMemoryDto } from '../dto/search-memory.dto';

@Controller('memory')
@UseGuards(JwtAuthGuard)
export class MemoryController {
  constructor(private readonly memoryService: MemoryService) {}

  @Post()
  async create(@Body() dto: CreateMemoryDto, @Req() req: { user: { id: string } }) {
    const memory = await this.memoryService.create(req.user.id, dto);
    return { data: memory };
  }

  @Get()
  async list(
    @Query('category') category: string | undefined,
    @Query('cursor') cursor: string | undefined,
    @Query('limit') limit: number | undefined,
    @Req() req: { user: { id: string } }
  ) {
    const result = await this.memoryService.list(req.user.id, category, cursor, limit);
    return { data: result.data, nextCursor: result.nextCursor, hasMore: result.hasMore };
  }

  @Get('search')
  async search(@Query() dto: SearchMemoryDto, @Req() req: { user: { id: string } }) {
    const result = await this.memoryService.search(req.user.id, dto);
    return { data: result.data, nextCursor: result.nextCursor, hasMore: result.hasMore };
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    const memory = await this.memoryService.findById(id, req.user.id);
    return { data: memory };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMemoryDto, @Req() req: { user: { id: string } }) {
    const memory = await this.memoryService.update(id, req.user.id, dto);
    return { data: memory };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    const memory = await this.memoryService.softDelete(id, req.user.id);
    return { data: memory };
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    const memory = await this.memoryService.restore(id, req.user.id);
    return { data: memory };
  }
}

import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UploadedFile,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  Headers,
  Head,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { FileService } from '../services/file.service';
import { UploadFileDto } from '../dto/upload-file.dto';
import { Request } from 'express';

@ApiTags('files')
@Controller('files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FileController {
  private readonly logger = new Logger(FileController.name);

  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        source: {
          type: 'string',
          enum: ['manual', 'import', 'attachment'],
        },
        sourceUrl: {
          type: 'string',
        },
        metadata: {
          type: 'object',
        },
      },
    },
  })
  async uploadFile(
    @CurrentUser() user: { userId: string },
    @UploadedFile() file: any,
    @Body() uploadDto: UploadFileDto,
    @Req() req: Request
  ) {
    const requestId = (req as any).requestId || 'unknown';
    this.logger.log({
      requestId,
      userId: user.userId,
      filename: file?.originalname,
      action: 'file.upload.request',
    });

    const result = await this.fileService.uploadFile(user.userId, file, {
      source: uploadDto.source,
      sourceUrl: uploadDto.sourceUrl,
      metadata: uploadDto.metadata,
    });

    return {
      success: true,
      data: result,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List user files' })
  async listFiles(@CurrentUser() user: { userId: string }, @Req() req: Request) {
    const requestId = (req as any).requestId || 'unknown';
    this.logger.log({
      requestId,
      userId: user.userId,
      action: 'file.list.request',
    });

    const result = await this.fileService.listFiles(user.userId);

    return {
      success: true,
      data: result.data,
      meta: result.meta,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file by ID' })
  @ApiParam({ name: 'id', description: 'File ID' })
  async getFile(@CurrentUser() user: { userId: string }, @Param('id') id: string, @Req() req: Request) {
    const requestId = (req as any).requestId || 'unknown';
    this.logger.log({
      requestId,
      userId: user.userId,
      fileId: id,
      action: 'file.get.request',
    });

    const result = await this.fileService.findById(id, user.userId);

    return {
      success: true,
      data: result,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete file' })
  @ApiParam({ name: 'id', description: 'File ID' })
  async deleteFile(@CurrentUser() user: { userId: string }, @Param('id') id: string, @Req() req: Request) {
    const requestId = (req as any).requestId || 'unknown';
    this.logger.log({
      requestId,
      userId: user.userId,
      fileId: id,
      action: 'file.delete.request',
    });

    const result = await this.fileService.deleteFile(id, user.userId);

    return {
      success: true,
      data: result,
    };
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore soft deleted file' })
  @ApiParam({ name: 'id', description: 'File ID' })
  async restoreFile(@CurrentUser() user: { userId: string }, @Param('id') id: string, @Req() req: Request) {
    const requestId = (req as any).requestId || 'unknown';
    this.logger.log({
      requestId,
      userId: user.userId,
      fileId: id,
      action: 'file.restore.request',
    });

    const result = await this.fileService.restoreFile(id, user.userId);

    return {
      success: true,
      data: result,
    };
  }

  @Get('download/:id')
  @ApiOperation({ summary: 'Download file' })
  @ApiParam({ name: 'id', description: 'File ID' })
  async downloadFile(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Req() req: Request,
    @Headers() _headers: any
  ) {
    const requestId = (req as any).requestId || 'unknown';
    this.logger.log({
      requestId,
      userId: user.userId,
      fileId: id,
      action: 'file.download.request',
    });

    const { file, buffer } = await this.fileService.getFileForDownload(id, user.userId);

    return {
      success: true,
      data: {
        filename: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
        buffer,
      },
    };
  }

  @Head(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if file exists' })
  @ApiParam({ name: 'id', description: 'File ID' })
  async checkFileExists(@CurrentUser() user: { userId: string }, @Param('id') id: string, @Req() req: Request) {
    const requestId = (req as any).requestId || 'unknown';
    this.logger.log({
      requestId,
      userId: user.userId,
      fileId: id,
      action: 'file.exists.request',
    });

    const exists = await this.fileService.checkFileExists(id, user.userId);

    return {
      success: true,
      data: { exists },
    };
  }
}
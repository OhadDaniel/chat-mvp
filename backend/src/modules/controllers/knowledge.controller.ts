import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ListDocumentsQueryDto } from '../documents/dto/list-documents.query.dto';
import { UploadDocumentDto } from '../documents/dto/upload-document.request.dto';
import { DeleteDocumentOrchestrator } from '../delete-document-orchestrator/delete-document.orchestrator';
import { IngestDocumentOrchestrator } from '../ingest-document-orchestrator/ingest-document.orchestrator';
import { ListDocumentsOrchestrator } from '../list-documents-orchestrator/list-documents.orchestrator';
import { MAX_FILE_BYTES } from '../ingest-document-orchestrator/ingest-document.constants';
import type { UploadedDocumentFile } from '../ingest-document-orchestrator/ingest-document.types';
import type {
  IngestDocumentResponse,
  ListDocumentsResponse,
} from '../documents/documents.types';
import type { User } from '../users/users.types';

const NO_CONTENT = 204;

@UseGuards(JwtAuthGuard)
@Controller('knowledge/documents')
export class KnowledgeController {
  constructor(
    private readonly ingestDocumentOrchestrator: IngestDocumentOrchestrator,
    private readonly listDocumentsOrchestrator: ListDocumentsOrchestrator,
    private readonly deleteDocumentOrchestrator: DeleteDocumentOrchestrator,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_FILE_BYTES } }),
  )
  upload(
    @CurrentUser() user: User,
    @Body() dto: UploadDocumentDto,
    @UploadedFile() file: UploadedDocumentFile,
  ): Promise<IngestDocumentResponse> {
    return this.ingestDocumentOrchestrator.execute(user.id, dto.tutorId, file);
  }

  @Get()
  list(
    @CurrentUser() user: User,
    @Query() query: ListDocumentsQueryDto,
  ): Promise<ListDocumentsResponse> {
    return this.listDocumentsOrchestrator.execute(user.id, query.tutorId);
  }

  @Delete(':id')
  @HttpCode(NO_CONTENT)
  remove(@CurrentUser() user: User, @Param('id') id: string): Promise<void> {
    return this.deleteDocumentOrchestrator.execute(user.id, id);
  }
}

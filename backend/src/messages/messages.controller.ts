import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { User } from '../users/users.types';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetMessagesQueryDto } from './dto/get-messages.query.dto';
import type {
  CreateMessageResponse,
  GetMessagesResponse,
} from './messages.types';
import { MessagesService } from './messages.service';

@UseGuards(JwtAuthGuard)
@Controller('conversations/:conversationId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  getPage(
    @CurrentUser() user: User,
    @Param('conversationId') conversationId: string,
    @Query() query: GetMessagesQueryDto,
  ): Promise<GetMessagesResponse> {
    return this.messagesService.getPage(conversationId, user.id, query);
  }

  @Post()
  create(
    @CurrentUser() user: User,
    @Param('conversationId') conversationId: string,
    @Body() dto: CreateMessageDto,
  ): Promise<CreateMessageResponse> {
    return this.messagesService.create(conversationId, user, dto);
  }
}

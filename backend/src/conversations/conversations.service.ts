import { randomUUID } from 'node:crypto'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { AppException } from '../common/errors/app.exception'
import { isUniqueViolation } from '../database/pg-errors'
import type { User } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'
import type {
  CreateConversationResponse,
  GetConversationsResponse,
  PatchConversationResponse,
} from './conversations.types'
import { ConversationsRepository } from './conversations.repository'
import type { Conversation } from './entities/conversation.entity'
import type { CreateConversationDto } from './dto/create-conversation.dto'
import type { PatchConversationDto } from './dto/patch-conversation.dto'

/**
 * Owns the conversations domain: the pair rules (distinct users,
 * one conversation per pair), pinning, and the participant
 * authorization rule (403). Exported as the module's only public API.
 */
@Injectable()
export class ConversationsService implements OnModuleInit {
  constructor(
    private readonly conversationsRepository: ConversationsRepository,
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedDemoConversations()
  }

  async list(
    userId: string,
    search?: string,
  ): Promise<GetConversationsResponse> {
    const conversations = await this.conversationsRepository.findAllByUserId(
      userId,
      search,
    )
    return { conversations }
  }

  async create(
    currentUser: User,
    dto: CreateConversationDto,
  ): Promise<CreateConversationResponse> {
    if (dto.participantId === currentUser.id) {
      throw new AppException(
        400,
        'INVALID_PARTICIPANT',
        'Cannot start a conversation with yourself',
      )
    }

    const participant = await this.usersService.findById(dto.participantId)
    if (!participant) {
      throw new AppException(404, 'USER_NOT_FOUND', 'Participant not found')
    }

    // Canonical order (a < b): one representation per pair, so the
    // UNIQUE constraint can do its job regardless of who initiates.
    const [userAId, userBId] = [currentUser.id, participant.id].sort()

    if (await this.conversationsRepository.existsByPair(userAId!, userBId!)) {
      throw new AppException(
        409,
        'CONVERSATION_ALREADY_EXISTS',
        'A conversation with this user already exists',
      )
    }

    const id = randomUUID()
    try {
      await this.conversationsRepository.insert(id, userAId!, userBId!)
    } catch (error) {
      // race-proof backstop: two simultaneous creates -> DB constraint
      if (isUniqueViolation(error)) {
        throw new AppException(
          409,
          'CONVERSATION_ALREADY_EXISTS',
          'A conversation with this user already exists',
        )
      }
      throw error
    }

    const conversation = await this.getByIdOrThrow(id)
    return { conversation }
  }

  async setPinned(
    conversationId: string,
    userId: string,
    dto: PatchConversationDto,
  ): Promise<PatchConversationResponse> {
    await this.getForParticipant(conversationId, userId)
    await this.conversationsRepository.setPinned(conversationId, dto.pinned)

    const conversation = await this.getByIdOrThrow(conversationId)
    return { conversation }
  }

  /**
   * The authorization rule, in one place: 404 if the conversation
   * doesn't exist, 403 if the caller isn't one of its two users.
   * MessagesService composes this — every message read/write passes
   * through here first.
   */
  async getForParticipant(
    conversationId: string,
    userId: string,
  ): Promise<Conversation> {
    const conversation = await this.getByIdOrThrow(conversationId)

    const isParticipant = conversation.participants.some(
      (participant) => participant.id === userId,
    )
    if (!isParticipant) {
      throw new AppException(
        403,
        'NOT_A_PARTICIPANT',
        'You are not a participant of this conversation',
      )
    }

    return conversation
  }

  private async getByIdOrThrow(id: string): Promise<Conversation> {
    const conversation = await this.conversationsRepository.findById(id)
    if (!conversation) {
      throw new AppException(
        404,
        'CONVERSATION_NOT_FOUND',
        'Conversation not found',
      )
    }
    return conversation
  }

  /** Demo conversations between the seeded users (same ids as week 3). */
  private async seedDemoConversations(): Promise<void> {
    if ((await this.conversationsRepository.count()) > 0) {
      return
    }

    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    await this.conversationsRepository.insert('conv-1', 'user-1', 'user-2', dayAgo)
    await this.conversationsRepository.insert('conv-2', 'user-1', 'user-3')
    await this.conversationsRepository.insert('conv-3', 'user-1', 'user-4')
  }
}

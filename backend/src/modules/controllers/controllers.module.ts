import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SignupModule } from '../signup-orchestrator/signup.module';
import { LoginModule } from '../login-orchestrator/login.module';
import { MeModule } from '../me-orchestrator/me.module';
import { ListUsersModule } from '../list-users-orchestrator/list-users.module';
import { UpdateProfileModule } from '../update-profile-orchestrator/update-profile.module';
import { RequestAvatarUploadModule } from '../request-avatar-upload-orchestrator/request-avatar-upload.module';
import { SetAvatarModule } from '../set-avatar-orchestrator/set-avatar.module';
import { RemoveAvatarModule } from '../remove-avatar-orchestrator/remove-avatar.module';
import { ListConversationsModule } from '../list-conversations-orchestrator/list-conversations.module';
import { CreateConversationRouterModule } from '../create-conversation-router-orchestrator/create-conversation-router.module';
import { RenameGroupModule } from '../rename-group-orchestrator/rename-group.module';
import { RequestGroupAvatarUploadModule } from '../request-group-avatar-upload-orchestrator/request-group-avatar-upload.module';
import { SetGroupAvatarModule } from '../set-group-avatar-orchestrator/set-group-avatar.module';
import { RemoveGroupAvatarModule } from '../remove-group-avatar-orchestrator/remove-group-avatar.module';
import { SetPinnedModule } from '../set-pinned-orchestrator/set-pinned.module';
import { GetMessagesModule } from '../get-messages-orchestrator/get-messages.module';
import { CreateMessageModule } from '../create-message-orchestrator/create-message.module';
import { StreamAssistantReplyModule } from '../stream-assistant-reply-orchestrator/stream-assistant-reply.module';
import { AuthController } from './auth.controller';
import { ProfileController } from './profile.controller';
import { UsersController } from './users.controller';
import { ConversationsController } from './conversations.controller';
import { MessagesController } from './messages.controller';
import { AssistantController } from './assistant.controller';

@Module({
  imports: [
    AuthModule,
    SignupModule,
    LoginModule,
    MeModule,
    ListUsersModule,
    UpdateProfileModule,
    RequestAvatarUploadModule,
    SetAvatarModule,
    RemoveAvatarModule,
    ListConversationsModule,
    CreateConversationRouterModule,
    RenameGroupModule,
    RequestGroupAvatarUploadModule,
    SetGroupAvatarModule,
    RemoveGroupAvatarModule,
    SetPinnedModule,
    GetMessagesModule,
    CreateMessageModule,
    StreamAssistantReplyModule,
  ],
  controllers: [
    AuthController,
    ProfileController,
    UsersController,
    ConversationsController,
    MessagesController,
    AssistantController,
  ],
})
export class ControllersModule {}

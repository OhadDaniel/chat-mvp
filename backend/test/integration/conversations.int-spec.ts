import type { INestApplication } from '@nestjs/common';
import type { Conversation } from '../../src/modules/conversations/conversations.types';
import { expectNoSecrets, http, loginAs, signupAs } from '../helpers/api';
import { createTestApp } from '../helpers/test-app';

describe('Conversations (integration)', () => {
  let app: INestApplication;
  let ohad: string; // tokens
  let eve: string;

  beforeAll(async () => {
    app = await createTestApp();
    ohad = await loginAs(app, 'ohad@chat.dev');
    eve = await signupAs(app, 'eve@chat.dev', 'Eve Intruder');
  });

  afterAll(async () => {
    await app.close();
  });

  it('every route is behind the guard: 401 without a token', async () => {
    await http(app).get('/conversations').expect(401);
    await http(app)
      .post('/conversations')
      .send({ participantId: 'x' })
      .expect(401);
    await http(app)
      .patch('/conversations/conv-1')
      .send({ pinned: true })
      .expect(401);
  });

  describe('GET /conversations', () => {
    it('returns the seeded list sorted by last activity, lastMessage derived', async () => {
      const response = await http(app)
        .get('/conversations')
        .set('Authorization', `Bearer ${ohad}`)
        .expect(200);

      const { conversations } = response.body as {
        conversations: Conversation[];
      };

      // newest activity first: conv-1 (2m) > conv-2 (18m) > conv-3 (60m).
      // ohad isn't in the seeded group, so his list is unchanged.
      expect(conversations.map((c) => c.id)).toEqual([
        'conv-1',
        'conv-2',
        'conv-3',
      ]);
      expect(conversations[0].lastMessage?.content).toBe(
        'sounds good, see you then!',
      );
      expect(conversations[0].pinnedAt).not.toBeNull();
      expect(conversations[0].participants).toHaveLength(2);
      expectNoSecrets(response.body);
    });

    it('returns a group conversation with its title, creator, and all members', async () => {
      const alice = await loginAs(app, 'alice@chat.dev'); // a member of the seeded group
      const response = await http(app)
        .get('/conversations')
        .set('Authorization', `Bearer ${alice}`)
        .expect(200);

      const { conversations } = response.body as {
        conversations: Conversation[];
      };
      const group = conversations.find((c) => c.id === 'conv-4');

      expect(group?.type).toBe('group');
      // narrow on the discriminant to reach the group-only fields
      if (group?.type === 'group') {
        expect(group.name).toBe('Fellowship Crew');
        expect(group.createdBy).toBe('user-2');
        expect(group.avatarUrl).toBeNull();
        expect(group.participants).toHaveLength(3);
      }
    });

    it('?search= filters by participant name, case-insensitively', async () => {
      const hit = await http(app)
        .get('/conversations?search=ALI')
        .set('Authorization', `Bearer ${ohad}`)
        .expect(200);
      const miss = await http(app)
        .get('/conversations?search=zzzz')
        .set('Authorization', `Bearer ${ohad}`)
        .expect(200);

      expect(
        (hit.body as { conversations: Conversation[] }).conversations.map(
          (c) => c.id,
        ),
      ).toEqual(['conv-1']); // Alice Levi
      expect(
        (miss.body as { conversations: Conversation[] }).conversations,
      ).toEqual([]);
    });

    it('a new user sees only their own conversations — none', async () => {
      const response = await http(app)
        .get('/conversations')
        .set('Authorization', `Bearer ${eve}`)
        .expect(200);

      expect(response.body).toEqual({ conversations: [] });
    });
  });

  describe('POST /conversations — the pair rules', () => {
    it('201 creates the conversation; the SAME pair from the OTHER side is 409', async () => {
      // ohad starts a conversation with eve
      const created = await http(app)
        .post('/conversations')
        .set('Authorization', `Bearer ${ohad}`)
        .send({
          participantId: (
            (await http(app).get('/me').set('Authorization', `Bearer ${eve}`))
              .body as { user: { id: string } }
          ).user.id,
        })
        .expect(201);

      const conversation = (created.body as { conversation: Conversation })
        .conversation;
      expect(conversation.lastMessage).toBeNull(); // no messages yet
      expect(conversation.participants.map((p) => p.id)).toContain('user-1');

      // eve tries to start one with ohad — same pair, reverse direction
      await http(app)
        .post('/conversations')
        .set('Authorization', `Bearer ${eve}`)
        .send({ participantId: 'user-1' })
        .expect(409);
    });

    it('400 with yourself, 404 with a ghost', async () => {
      await http(app)
        .post('/conversations')
        .set('Authorization', `Bearer ${ohad}`)
        .send({ participantId: 'user-1' })
        .expect(400);

      await http(app)
        .post('/conversations')
        .set('Authorization', `Bearer ${ohad}`)
        .send({ participantId: 'ghost-99' })
        .expect(404);
    });
  });

  describe('PATCH /conversations/:id', () => {
    it('participant can pin and unpin; pinnedAt reflects reality', async () => {
      const pinned = await http(app)
        .patch('/conversations/conv-2')
        .set('Authorization', `Bearer ${ohad}`)
        .send({ pinned: true })
        .expect(200);
      expect(
        (pinned.body as { conversation: Conversation }).conversation.pinnedAt,
      ).not.toBeNull();

      const unpinned = await http(app)
        .patch('/conversations/conv-2')
        .set('Authorization', `Bearer ${ohad}`)
        .send({ pinned: false })
        .expect(200);
      expect(
        (unpinned.body as { conversation: Conversation }).conversation.pinnedAt,
      ).toBeNull();
    });

    it('403 for an authenticated non-participant — authorization, not authentication', async () => {
      const response = await http(app)
        .patch('/conversations/conv-2')
        .set('Authorization', `Bearer ${eve}`)
        .send({ pinned: true })
        .expect(403);

      expect(response.body).toMatchObject({
        error: { code: 'NOT_A_PARTICIPANT' },
      });
    });

    it('404 for a conversation that does not exist', async () => {
      await http(app)
        .patch('/conversations/ghost-conv')
        .set('Authorization', `Bearer ${ohad}`)
        .send({ pinned: true })
        .expect(404);
    });

    it('400 when pinned is not a boolean', async () => {
      await http(app)
        .patch('/conversations/conv-2')
        .set('Authorization', `Bearer ${ohad}`)
        .send({ pinned: 'yes' })
        .expect(400);
    });
  });

  describe('POST /conversations/groups', () => {
    it('is behind the guard: 401 without a token', async () => {
      await http(app)
        .post('/conversations/groups')
        .send({ name: 'x', participantIds: [] })
        .expect(401);
    });

    it('201 creates a group with title, creator, and all members joined', async () => {
      const created = await http(app)
        .post('/conversations/groups')
        .set('Authorization', `Bearer ${ohad}`)
        .send({ name: 'Planning', participantIds: ['user-2', 'user-3'] })
        .expect(201);

      const { conversation } = created.body as { conversation: Conversation };
      expect(conversation.type).toBe('group');
      if (conversation.type === 'group') {
        expect(conversation.name).toBe('Planning');
        expect(conversation.createdBy).toBe('user-1');
        expect(conversation.avatarUrl).toBeNull();
      }
      // creator + the two picked, deduped, joined to profiles
      expect(conversation.participants.map((p) => p.id)).toEqual([
        'user-1',
        'user-2',
        'user-3',
      ]);

      // and it shows up in the creator's list, as a group
      const list = await http(app)
        .get('/conversations')
        .set('Authorization', `Bearer ${ohad}`)
        .expect(200);
      const mine = (
        list.body as { conversations: Conversation[] }
      ).conversations.find((c) => c.id === conversation.id);
      expect(mine?.type).toBe('group');
    });

    it('400 for an empty title, and 400 for more than 30 members', async () => {
      await http(app)
        .post('/conversations/groups')
        .set('Authorization', `Bearer ${ohad}`)
        .send({ name: '', participantIds: [] })
        .expect(400);

      await http(app)
        .post('/conversations/groups')
        .set('Authorization', `Bearer ${ohad}`)
        .send({
          name: 'Too big',
          participantIds: Array.from({ length: 31 }, (_, i) => `u${i}`),
        })
        .expect(400);
    });

    it('404 when a picked participant does not exist', async () => {
      await http(app)
        .post('/conversations/groups')
        .set('Authorization', `Bearer ${ohad}`)
        .send({ name: 'Ghosts', participantIds: ['ghost-99'] })
        .expect(404);
    });
  });

  describe('PATCH /conversations/groups/:id — rename (creator only)', () => {
    it('is behind the guard: 401 without a token', async () => {
      await http(app)
        .patch('/conversations/groups/conv-4')
        .send({ name: 'x' })
        .expect(401);
    });

    it('the creator can rename the group', async () => {
      const alice = await loginAs(app, 'alice@chat.dev'); // creator of the seeded group
      const response = await http(app)
        .patch('/conversations/groups/conv-4')
        .set('Authorization', `Bearer ${alice}`)
        .send({ name: 'Renamed Crew' })
        .expect(200);

      const { conversation } = response.body as { conversation: Conversation };
      expect(conversation.type).toBe('group');
      if (conversation.type === 'group') {
        expect(conversation.name).toBe('Renamed Crew');
      }
    });

    it('403 for a member who is not the creator', async () => {
      const ben = await loginAs(app, 'ben@chat.dev'); // member of the group, not its creator
      const response = await http(app)
        .patch('/conversations/groups/conv-4')
        .set('Authorization', `Bearer ${ben}`)
        .send({ name: 'Nope' })
        .expect(403);

      expect(response.body).toMatchObject({
        error: { code: 'NOT_GROUP_OWNER' },
      });
    });

    it('404 when the id is a DM — there is no title to edit', async () => {
      await http(app)
        .patch('/conversations/groups/conv-1')
        .set('Authorization', `Bearer ${ohad}`)
        .send({ name: 'x' })
        .expect(404);
    });

    it('400 for an empty title', async () => {
      const alice = await loginAs(app, 'alice@chat.dev');
      await http(app)
        .patch('/conversations/groups/conv-4')
        .set('Authorization', `Bearer ${alice}`)
        .send({ name: '' })
        .expect(400);
    });
  });

  describe('group avatar (creator only)', () => {
    it('401 without a token', async () => {
      await http(app).put('/conversations/groups/conv-4/avatar').expect(401);
    });

    it('upload-url: creator gets a presigned POST; member → 403; bad type → 400; DM → 404', async () => {
      const alice = await loginAs(app, 'alice@chat.dev'); // creator
      const ok = await http(app)
        .post('/conversations/groups/conv-4/avatar/upload-url')
        .set('Authorization', `Bearer ${alice}`)
        .send({ contentType: 'image/png' })
        .expect(201);
      expect((ok.body as { url: string }).url).toContain('https://');
      expect((ok.body as { fields: unknown }).fields).toBeTruthy();

      const ben = await loginAs(app, 'ben@chat.dev'); // member, not creator
      await http(app)
        .post('/conversations/groups/conv-4/avatar/upload-url')
        .set('Authorization', `Bearer ${ben}`)
        .send({ contentType: 'image/png' })
        .expect(403);

      await http(app)
        .post('/conversations/groups/conv-4/avatar/upload-url')
        .set('Authorization', `Bearer ${alice}`)
        .send({ contentType: 'image/gif' })
        .expect(400);

      await http(app)
        .post('/conversations/groups/conv-1/avatar/upload-url') // conv-1 is a DM
        .set('Authorization', `Bearer ${alice}`)
        .send({ contentType: 'image/png' })
        .expect(404);
    });

    it('set then remove: creator sets a photo url, a member is blocked, creator clears it', async () => {
      const alice = await loginAs(app, 'alice@chat.dev');
      const set = await http(app)
        .put('/conversations/groups/conv-4/avatar')
        .set('Authorization', `Bearer ${alice}`)
        .expect(200);
      const setBody = (set.body as { conversation: Conversation }).conversation;
      expect(setBody.type).toBe('group');
      if (setBody.type === 'group') {
        expect(
          setBody.avatarUrl?.startsWith(
            'https://test.cloudfront.net/groups/conv-4/avatar?v=',
          ),
        ).toBe(true);
      }

      const ben = await loginAs(app, 'ben@chat.dev');
      await http(app)
        .put('/conversations/groups/conv-4/avatar')
        .set('Authorization', `Bearer ${ben}`)
        .expect(403);

      const removed = await http(app)
        .delete('/conversations/groups/conv-4/avatar')
        .set('Authorization', `Bearer ${alice}`)
        .expect(200);
      const removedBody = (removed.body as { conversation: Conversation })
        .conversation;
      if (removedBody.type === 'group') {
        expect(removedBody.avatarUrl).toBeNull();
      }
    });
  });
});

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

      // newest activity first: conv-1 (2m) > conv-2 (18m) > conv-3 (60m)
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
});

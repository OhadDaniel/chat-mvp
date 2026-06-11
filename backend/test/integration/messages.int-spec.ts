import type { INestApplication } from '@nestjs/common';
import type { Conversation } from '../../src/modules/conversations/conversations.types';
import type { Message } from '../../src/modules/messages/messages.types';
import { expectNoSecrets, http, loginAs, signupAs } from '../helpers/api';
import { createTestApp } from '../helpers/test-app';

type Page = { messages: Message[]; nextCursor: string | null };

describe('Messages (integration)', () => {
  let app: INestApplication;
  let alice: string; // participant of conv-1
  let eve: string; // authenticated outsider

  beforeAll(async () => {
    app = await createTestApp();
    alice = await loginAs(app, 'alice@chat.dev');
    eve = await signupAs(app, 'eve@chat.dev', 'Eve Intruder');
  });

  afterAll(async () => {
    await app.close();
  });

  it('guard: 401 without a token', async () => {
    await http(app).get('/conversations/conv-1/messages').expect(401);
  });

  describe('GET /conversations/:id/messages — chat-style pagination', () => {
    it('returns the seeded history ascending, senders without secrets', async () => {
      const response = await http(app)
        .get('/conversations/conv-1/messages')
        .set('Authorization', `Bearer ${alice}`)
        .expect(200);

      const page = response.body as Page;
      expect(page.messages.map((m) => m.id)).toEqual([
        'msg-1',
        'msg-2',
        'msg-3',
      ]);
      expect(page.nextCursor).toBeNull(); // whole history fits the page
      expectNoSecrets(response.body);
    });

    it('limit=2 returns the NEWEST two and a cursor pointing into history', async () => {
      const response = await http(app)
        .get('/conversations/conv-1/messages?limit=2')
        .set('Authorization', `Bearer ${alice}`)
        .expect(200);

      const page = response.body as Page;
      expect(page.messages.map((m) => m.id)).toEqual(['msg-2', 'msg-3']);
      expect(page.nextCursor).toBe('msg-2');
    });

    it('following the cursor walks into older history until null', async () => {
      const response = await http(app)
        .get('/conversations/conv-1/messages?limit=2&cursor=msg-2')
        .set('Authorization', `Bearer ${alice}`)
        .expect(200);

      const page = response.body as Page;
      expect(page.messages.map((m) => m.id)).toEqual(['msg-1']);
      expect(page.nextCursor).toBeNull(); // end of history
    });

    it('an unknown cursor behaves like no cursor (week-3 contract)', async () => {
      const response = await http(app)
        .get('/conversations/conv-1/messages?cursor=not-a-real-id')
        .set('Authorization', `Bearer ${alice}`)
        .expect(200);

      expect((response.body as Page).messages.map((m) => m.id)).toEqual([
        'msg-1',
        'msg-2',
        'msg-3',
      ]);
    });

    it('400 for a non-numeric or non-positive limit', async () => {
      await http(app)
        .get('/conversations/conv-1/messages?limit=abc')
        .set('Authorization', `Bearer ${alice}`)
        .expect(400);
      await http(app)
        .get('/conversations/conv-1/messages?limit=0')
        .set('Authorization', `Bearer ${alice}`)
        .expect(400);
    });
  });

  describe('POST /conversations/:id/messages', () => {
    it('201 — and the conversation lastMessage updates WITHOUT any update code (derived)', async () => {
      await http(app)
        .post('/conversations/conv-1/messages')
        .set('Authorization', `Bearer ${alice}`)
        .send({ content: 'fresh message from the test suite' })
        .expect(201);

      const list = await http(app)
        .get('/conversations')
        .set('Authorization', `Bearer ${alice}`)
        .expect(200);

      const conv1 = (
        list.body as { conversations: Conversation[] }
      ).conversations.find((c) => c.id === 'conv-1');
      expect(conv1?.lastMessage?.content).toBe(
        'fresh message from the test suite',
      );
    });

    it('400 for empty content and for content above 2000 chars', async () => {
      await http(app)
        .post('/conversations/conv-1/messages')
        .set('Authorization', `Bearer ${alice}`)
        .send({ content: '' })
        .expect(400);
      await http(app)
        .post('/conversations/conv-1/messages')
        .set('Authorization', `Bearer ${alice}`)
        .send({ content: 'x'.repeat(2001) })
        .expect(400);
    });

    it('404 for a conversation that does not exist', async () => {
      await http(app)
        .post('/conversations/ghost-conv/messages')
        .set('Authorization', `Bearer ${alice}`)
        .send({ content: 'hello?' })
        .expect(404);
    });
  });

  describe('the authorization rule — 403, never the data', () => {
    it('an authenticated outsider can neither read nor write', async () => {
      const read = await http(app)
        .get('/conversations/conv-1/messages')
        .set('Authorization', `Bearer ${eve}`)
        .expect(403);
      const write = await http(app)
        .post('/conversations/conv-1/messages')
        .set('Authorization', `Bearer ${eve}`)
        .send({ content: 'let me in' })
        .expect(403);

      // not a single byte of conversation content leaks in either response
      for (const body of [read.body, write.body]) {
        expect(JSON.stringify(body)).not.toContain('sounds good');
        expect(body).toMatchObject({ error: { code: 'NOT_A_PARTICIPANT' } });
      }
    });
  });
});

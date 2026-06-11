import type { INestApplication } from '@nestjs/common';
import type { Conversation } from '../../src/modules/conversations/conversations.types';
import type { Message } from '../../src/modules/messages/messages.types';
import { http } from '../helpers/api';
import { createTestApp } from '../helpers/test-app';

/**
 * E2E smoke: two complete user journeys, end to end.
 * Few tests, many steps each — they protect the product, not a unit.
 */
describe('Chat journeys (e2e smoke)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('a stranger signs up, starts a chat with a seeded user and talks', async () => {
    // 1. signup -> token
    const signup = await http(app)
      .post('/auth/signup')
      .send({ email: 'noa@chat.dev', password: 'S3cret!pass', name: 'Noa Bar' })
      .expect(201);
    const token = (signup.body as { token: string }).token;
    const auth = ['Authorization', `Bearer ${token}`] as const;

    // 2. session restore works (what the FE does on refresh)
    await http(app)
      .get('/me')
      .set(...auth)
      .expect(200);

    // 3. empty chat list — she knows nobody yet
    const empty = await http(app)
      .get('/conversations')
      .set(...auth)
      .expect(200);
    expect(
      (empty.body as { conversations: Conversation[] }).conversations,
    ).toEqual([]);

    // 4. start a conversation with seeded Alice
    const created = await http(app)
      .post('/conversations')
      .set(...auth)
      .send({ participantId: 'user-2' })
      .expect(201);
    const conversationId = (created.body as { conversation: Conversation })
      .conversation.id;

    // 5. send the first message
    await http(app)
      .post(`/conversations/${conversationId}/messages`)
      .set(...auth)
      .send({ content: 'hey Alice, testing end to end!' })
      .expect(201);

    // 6. the chat list now shows the conversation with a live preview
    const list = await http(app)
      .get('/conversations')
      .set(...auth)
      .expect(200);
    const conversation = (
      list.body as { conversations: Conversation[] }
    ).conversations.find((c) => c.id === conversationId);
    expect(conversation?.lastMessage?.content).toBe(
      'hey Alice, testing end to end!',
    );

    // 7. ...and Alice (the other participant) can read it
    const aliceLogin = await http(app)
      .post('/auth/login')
      .send({ email: 'alice@chat.dev', password: 'Password123!' })
      .expect(200);
    const aliceToken = (aliceLogin.body as { token: string }).token;

    const aliceView = await http(app)
      .get(`/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${aliceToken}`)
      .expect(200);
    expect(
      (aliceView.body as { messages: Message[] }).messages.at(-1)?.content,
    ).toBe('hey Alice, testing end to end!');
  });

  it("an intruder with a valid account hits a wall on every door of someone else's chat", async () => {
    const signup = await http(app)
      .post('/auth/signup')
      .send({
        email: 'mallory@chat.dev',
        password: 'S3cret!pass',
        name: 'Mallory',
      })
      .expect(201);
    const auth = [
      'Authorization',
      `Bearer ${(signup.body as { token: string }).token}`,
    ] as const;

    // read messages, write a message, pin — all three doors locked
    await http(app)
      .get('/conversations/conv-1/messages')
      .set(...auth)
      .expect(403);
    await http(app)
      .post('/conversations/conv-1/messages')
      .set(...auth)
      .send({ content: 'let me in' })
      .expect(403);
    await http(app)
      .patch('/conversations/conv-1')
      .set(...auth)
      .send({ pinned: true })
      .expect(403);

    // and her own list remains untouched by the attempts
    const list = await http(app)
      .get('/conversations')
      .set(...auth)
      .expect(200);
    expect(
      (list.body as { conversations: Conversation[] }).conversations,
    ).toEqual([]);
  });
});

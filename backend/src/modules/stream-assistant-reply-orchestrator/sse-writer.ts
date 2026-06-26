import type { Response } from 'express';

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive',
};

const EVENT_DELTA = 'delta';
const EVENT_DONE = 'done';
const EVENT_ERROR = 'error';

export class SseWriter {
  constructor(private readonly response: Response) {}

  open(): void {
    this.response.writeHead(200, SSE_HEADERS);
  }

  delta(text: string): void {
    this.send(EVENT_DELTA, { text });
  }

  done(messageId: string): void {
    this.send(EVENT_DONE, { messageId });
  }

  error(code: string): void {
    this.send(EVENT_ERROR, { code });
  }

  end(): void {
    this.response.end();
  }

  private send(event: string, data: unknown): void {
    this.response.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  }
}

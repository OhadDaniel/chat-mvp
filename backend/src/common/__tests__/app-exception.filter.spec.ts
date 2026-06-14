import { Logger, NotFoundException, type ArgumentsHost } from '@nestjs/common';
import { AppException } from '../errors/app.exception';
import { AppExceptionFilter } from '../filters/app-exception.filter';

type CapturedResponse = {
  statusCode?: number;
  body?: unknown;
};

type MockResponse = {
  status: (code: number) => MockResponse;
  json: (body: unknown) => void;
};

/** Minimal mock of the HTTP response + ArgumentsHost. */
function run(exception: unknown): CapturedResponse {
  const captured: CapturedResponse = {};
  const response: MockResponse = {
    status: (code: number) => {
      captured.statusCode = code;
      return response;
    },
    json: (body: unknown) => {
      captured.body = body;
    },
  };
  const host = {
    switchToHttp: () => ({ getResponse: () => response }),
  } as unknown as ArgumentsHost;

  new AppExceptionFilter().catch(exception, host);
  return captured;
}

beforeAll(() => {
  // the filter logs every exception — keep test output clean
  jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
  jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
});

describe('AppExceptionFilter — every exception leaves in the same envelope', () => {
  it('AppException keeps its status, code and details', () => {
    const result = run(
      new AppException(409, 'EMAIL_ALREADY_EXISTS', 'taken', {
        email: ['taken'],
      }),
    );

    expect(result.statusCode).toBe(409);
    expect(result.body).toEqual({
      error: {
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'taken',
        details: { email: ['taken'] },
      },
    });
  });

  it('built-in HttpExceptions get a code derived from their status', () => {
    const result = run(new NotFoundException());

    expect(result.statusCode).toBe(404);
    expect(result.body).toMatchObject({ error: { code: 'NOT_FOUND' } });
  });

  it('unknown errors become a generic 500 — internals never leak to clients', () => {
    const result = run(new Error('pg: connection refused at 10.0.0.5'));

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
    // the real error text must NOT be in the response
    expect(JSON.stringify(result.body)).not.toContain('10.0.0.5');
  });
});

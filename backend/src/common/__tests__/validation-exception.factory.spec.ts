import type { ValidationError } from '@nestjs/common';
import { validationExceptionFactory } from '../pipes/validation-exception.factory';

describe('validationExceptionFactory', () => {
  it('produces a 400 VALIDATION_ERROR with field-level details', () => {
    const errors: ValidationError[] = [
      {
        property: 'email',
        constraints: { isEmail: 'email must be an email' },
      },
    ];

    const exception = validationExceptionFactory(errors);

    expect(exception.getStatus()).toBe(400);
    expect(exception.code).toBe('VALIDATION_ERROR');
    expect(exception.details).toEqual({
      email: ['email must be an email'],
    });
  });

  it('flattens nested errors into dotted paths', () => {
    const errors: ValidationError[] = [
      {
        property: 'address',
        children: [
          {
            property: 'city',
            constraints: { isString: 'city must be a string' },
          },
        ],
      },
    ];

    const exception = validationExceptionFactory(errors);

    expect(exception.details).toEqual({
      'address.city': ['city must be a string'],
    });
  });
});

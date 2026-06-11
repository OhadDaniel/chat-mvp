import type { ValidationError } from '@nestjs/common';
import { AppException } from '../errors/app.exception';

export type FieldErrors = Record<string, string[]>;

/**
 * Shapes class-validator failures into the Week 3 contract:
 * 400 VALIDATION_ERROR with field-level details, e.g.
 * `{ details: { email: ['email must be an email'] } }`.
 */
export function validationExceptionFactory(
  errors: ValidationError[],
): AppException {
  return new AppException(
    400,
    'VALIDATION_ERROR',
    'Request validation failed',
    flatten(errors),
  );
}

function flatten(errors: ValidationError[], parentPath = ''): FieldErrors {
  const fieldErrors: FieldErrors = {};

  for (const error of errors) {
    const path = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      fieldErrors[path] = Object.values(error.constraints);
    }

    if (error.children && error.children.length > 0) {
      Object.assign(fieldErrors, flatten(error.children, path));
    }
  }

  return fieldErrors;
}

import { ErrorCodes } from './error-codes.js';
import type { IDuplicatedElementError } from '../types/index.js';

export const DuplicatedElementError = {
    of: <T>(duplicant: T): IDuplicatedElementError<T> => ({
        code: ErrorCodes.DUPLICATED_ELEMENT,
        message: `The same element or its equivalent is already presented in the list.`,
        details: { duplicant },
    }),
} as const;

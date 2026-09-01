import { ErrorCodes } from './error-codes.js';
import type { IDuplicatedElementError, IEquatable } from '../types/index.js';

export const DuplicatedElementError = {
    of: <T extends IEquatable<T>>(duplicant: T, origin: T): IDuplicatedElementError<T> => ({
        code: ErrorCodes.DUPLICATED_ELEMENT,
        message: `The same element or its equivalent is already presented in the list`,
        details: { duplicant, origin },
    }),
} as const;

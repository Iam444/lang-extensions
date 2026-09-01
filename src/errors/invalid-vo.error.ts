import { AbstractVO } from '../value-object/index.js';
import { ErrorCodes } from './error-codes.js';
import type { TConstructor, IInvalidVOError } from '../types/index.js';

export const InvalidVOError = {
    of: (voClass: TConstructor<AbstractVO>, value: unknown, rule: string): IInvalidVOError => ({
        code: ErrorCodes.INVALID_VO,
        message: `Failed to create ${voClass.name}`,
        details: { voClass, rule, value },
    }),
} as const;

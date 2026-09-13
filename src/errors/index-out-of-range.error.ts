import { ErrorCodes } from './error-codes.js';
import type { IIndexOutOfRangeError } from '../types/index.js';

export const IndexOutOfRangeError = {
    of: (message: string, index: number, listSize: number): IIndexOutOfRangeError => ({
        code: ErrorCodes.INDEX_OUT_OF_RANGE,
        message: `${message}. Index: ${index}. List size: ${listSize}`,
        details: { index, listSize },
    }),
} as const;

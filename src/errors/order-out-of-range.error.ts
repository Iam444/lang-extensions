import { ErrorCodes } from './error-codes.js';
import type { IOrderOutOfRangeError } from '../types/index.js';

export const OrderOutOfRangeError = {
    of: (position: number, listSize: number): IOrderOutOfRangeError => ({
        code: ErrorCodes.ORDER_OUT_OF_RANGE,
        message: `The position is out of the lists range.`,
        details: { position, listSize },
    }),
} as const;

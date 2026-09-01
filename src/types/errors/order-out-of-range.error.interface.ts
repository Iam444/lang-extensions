import type { ErrorCodes } from '../../errors/index.js';
import type { IBaseError } from './base-error.interface.js';

export interface IOrderOutOfRangeError extends IBaseError {
    readonly code: typeof ErrorCodes.ORDER_OUT_OF_RANGE;
    readonly details: {
        readonly position: number;
        readonly listSize: number;
    };
}

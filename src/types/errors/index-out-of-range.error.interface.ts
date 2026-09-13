import type { ErrorCodes } from '../../errors/index.js';
import type { IBaseError } from './base-error.interface.js';

export interface IIndexOutOfRangeError extends IBaseError {
    readonly code: typeof ErrorCodes.INDEX_OUT_OF_RANGE;
    readonly details: {
        readonly index: number;
        readonly listSize: number;
    };
}

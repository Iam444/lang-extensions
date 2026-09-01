import type { ErrorCodes } from '../../errors/index.js';
import type { IBaseError } from './base-error.interface.js';

export interface IDuplicatedElementError<T> extends IBaseError {
    readonly code: typeof ErrorCodes.DUPLICATED_ELEMENT;
    readonly details: {
        readonly duplicant: T;
        readonly origin: T;
    };
}

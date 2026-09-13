import type { IBaseError } from './base-error.interface.js';

export interface IDuplicatedElementError<T> extends IBaseError {
    readonly details: {
        readonly duplicant: T;
    };
}

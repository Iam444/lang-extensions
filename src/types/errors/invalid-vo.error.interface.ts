import type { ErrorCodes } from '../../errors/index.js';
import type { IBaseError, TConstructor } from '../index.js';
import type { AbstractVO } from '../../value-object/index.js';

export interface IInvalidVOError extends IBaseError {
    readonly code: typeof ErrorCodes.INVALID_VO;
    readonly details: {
        readonly voClass: TConstructor<AbstractVO>;
        readonly rule: string;
        readonly value: unknown;
    };
}

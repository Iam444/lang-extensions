import { Result } from '../result/index.js';
import { InvalidVOError } from '../errors/index.js';
import type { IEquatable, TConstructor, IInvalidVOError } from '../types/index.js';

export abstract class AbstractVO implements IEquatable<AbstractVO> {
    public static of<C extends TConstructor<T>, T extends AbstractVO = C extends TConstructor<infer T> ? T : never>(
        this: C,
        ...arguments_: ConstructorParameters<typeof this>
    ): Result<T, IInvalidVOError> {
        const inst = new this(...arguments_);

        if (!inst._isValid()) {
            return Result.failure(inst._getValidationError());
        }

        return Result.success(inst);
    }

    public equals<T extends AbstractVO>(other: T): boolean {
        if (this.constructor !== other.constructor) {
            return false;
        }

        return this.toString() === other.toString();
    }

    protected _getValidationError(): IInvalidVOError {
        return InvalidVOError.of(this.constructor as TConstructor<typeof this>, this._getValue(), this._getInvalidityDescription());
    }

    public abstract toString(): string;

    protected abstract _isValid(): boolean;

    protected abstract _getValue(): unknown;

    protected abstract _getInvalidityDescription(): string;
}

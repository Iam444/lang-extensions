import { AbstractVO } from '../value-object/index.js';
import type { Result } from '../result/index.js';
import type { IInvalidVOError } from '../types/index.js';

export class Order extends AbstractVO {
    public static fromIndex(index: number): Result<Order, IInvalidVOError> {
        return this.of(index + 1);
    }

    constructor(public readonly value: number) {
        super();
    }

    public toIndex(): number {
        return this.value - 1;
    }

    public toString(): string {
        return String(this.value);
    }

    protected _isValid(): boolean {
        return Number.isInteger(this.value) && this.value > 0;
    }

    protected _getValue(): number {
        return this.value;
    }

    protected _getInvalidityDescription(): string {
        return 'The value must be a natural number (positive integer)';
    }
}

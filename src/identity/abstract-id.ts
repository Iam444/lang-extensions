import { AbstractVO } from '../value-object/index.js';

export abstract class AbstractID<TValue extends number | string = number | string> extends AbstractVO {
    constructor(public readonly value: TValue) {
        super();
    }

    public toString(): string {
        return String(this.value);
    }

    protected _getValue(): TValue {
        return this.value;
    }
}

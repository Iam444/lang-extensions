import { UUIDGenerator } from '../uuid/index.js';
import { CorruptedInvariantException } from '../errors/corrupted-invariant.exception.js';
import { AbstractStringID } from './abstract-string-id.js';
import type { TConstructor } from '../types/index.js';

export abstract class AbstractUUID extends AbstractStringID {
    public static generate<C extends TConstructor<T>, T extends AbstractUUID = C extends TConstructor<infer T> ? T : never>(this: C): T {
        return new this();
    }

    constructor(id?: string) {
        super(id || UUIDGenerator.generate());
    }

    protected override validate(): void {
        super.validate();

        if (!UUIDGenerator.isValid(this.value)) {
            throw new CorruptedInvariantException(`The value must be a valid UUID string. Provided: ${this.value}`, {
                value: this.value,
                className: this.constructor.name,
            });
        }
    }
}

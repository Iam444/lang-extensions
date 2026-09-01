import { UUIDGenerator } from '../uuid/index.js';
import { AbstractStringID } from './abstract-string-id.js';
import type { TConstructor } from '../types/index.js';

export abstract class AbstractUUID extends AbstractStringID {
    public static create<C extends TConstructor<T>, T extends AbstractUUID = C extends TConstructor<infer T> ? T : never>(this: C): T {
        return new this();
    }

    constructor(id?: string) {
        super(id || UUIDGenerator.generate());
    }

    protected override _isValid(): boolean {
        return typeof this.value === 'string' && UUIDGenerator.isValid(this.value);
    }

    protected override _getInvalidityDescription(): string {
        return 'The value must be a valid UUID string';
    }
}

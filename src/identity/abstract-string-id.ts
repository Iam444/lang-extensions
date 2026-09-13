import { CorruptedInvariantException } from '../errors/corrupted-invariant.exception.js';
import { AbstractID } from './abstract-id.js';

export abstract class AbstractStringID extends AbstractID<string> {
    protected validate(): void {
        if (typeof this.value !== 'string' || this.value.length === 0) {
            throw new CorruptedInvariantException('The value must be a non-empty string.', {
                value: this.value,
                valueType: typeof this.value,
                className: this.constructor.name,
            });
        }
    }
}

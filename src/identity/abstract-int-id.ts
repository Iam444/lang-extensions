import { CorruptedInvariantException } from '../errors/corrupted-invariant.exception.js';
import { AbstractID } from './abstract-id.js';

export abstract class AbstractIntID extends AbstractID<number> {
    protected validate(): void {
        if (!Number.isInteger(this.value) || this.value <= 0) {
            throw new CorruptedInvariantException('The value must be a natural number (positive integer).', {
                value: this.value,
                valueType: typeof this.value,
                className: this.constructor.name,
            });
        }
    }
}

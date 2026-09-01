import { AbstractID } from './abstract-id.js';

export abstract class AbstractIntID extends AbstractID<number> {
    protected _isValid(): boolean {
        return Number.isInteger(this.value) && this.value > 0;
    }

    protected _getInvalidityDescription(): string {
        return 'The value must be a natural number (positive integer)';
    }
}

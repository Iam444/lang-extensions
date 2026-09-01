import { AbstractID } from './abstract-id.js';

export abstract class AbstractStringID extends AbstractID<string> {
    protected _isValid(): boolean {
        return typeof this.value === 'string' && this.value.length > 0;
    }

    protected _getInvalidityDescription(): string {
        return 'The value must be a non-empty string';
    }
}

import { AbstractSystemException } from './abstract-system-exception.js';

export class FailureUnwrappedException extends AbstractSystemException {
    constructor() {
        super('Attempted to unwrap a failure result value. It does not exist.');
    }
}

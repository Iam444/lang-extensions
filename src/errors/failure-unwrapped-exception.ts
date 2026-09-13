import { AbstractInternalSystemException } from './abstract-internal-system.exception.js';

export class FailureUnwrappedException extends AbstractInternalSystemException {
    constructor(failure: object) {
        super('Attempted to unwrap a failure result value. It does not exist.', failure);
    }
}

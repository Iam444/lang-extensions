import { AbstractInternalSystemException } from './abstract-internal-system.exception.js';

export class CorruptedInvariantException extends AbstractInternalSystemException {
    constructor(message: string, cause: Record<string, unknown>) {
        super(`[CORRUPTED_INVARIANT] ${message}`, cause);
    }
}

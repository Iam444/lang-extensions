export abstract class AbstractInternalSystemException extends Error {
    protected constructor(message: string, cause: unknown) {
        super(message, { cause });
    }
}

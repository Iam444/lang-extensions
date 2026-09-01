export abstract class AbstractSystemException extends Error {
    protected constructor(message: string, cause?: unknown) {
        super(message, { cause });
    }
}

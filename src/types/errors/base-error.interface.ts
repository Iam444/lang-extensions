export interface IBaseError {
    readonly code: string;
    readonly message: string;
    readonly details?: Record<string, unknown>;
}

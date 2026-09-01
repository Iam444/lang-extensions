import { FailureUnwrappedException } from '../errors/index.js';
import type { IBaseError } from '../types/index.js';

export abstract class Result<TValue, TError extends IBaseError> {
    public static combine<
        TResults extends Result<TUnitedValue, TUnitedError>[],
        TUnitedValue extends TValuesTuple[number],
        TUnitedError extends (TResults[number] extends Result<unknown, infer TInferredError> ? TInferredError : never),
        TValuesTuple extends {
            [K in keyof TResults]: TResults[K] extends Result<infer TInferredValue, IBaseError> ? TInferredValue : never;
        },
    >(...results: TResults): Result<TValuesTuple, TUnitedError> {
        const values: TUnitedValue[] = [];

        for (const result of results) {
            if (result.isFailure()) {
                return this.failure(result.error);
            }

            if (result.isSuccess()) {
                values.push(result.value);
            }
        }

        return this.success(values as TValuesTuple);
    }

    public static success(): Result<void, never>;
    public static success<TValue>(value: TValue): Result<TValue, never>;
    public static success<TValue>(value?: TValue): Result<TValue, never> {
        return new Success(value as TValue);
    }

    public static failure<TError extends IBaseError>(error: TError): Result<never, TError> {
        return new Failure(error);
    }

    protected constructor(private readonly _isSuccessful: boolean) {}

    public isSuccess(): this is Success<TValue> {
        return this._isSuccessful;
    }

    public isFailure(): this is Failure<TError> {
        return !this._isSuccessful;
    }

    public unwrap(): TValue {
        if (this.isSuccess()) {
            return this.value;
        }

        throw new FailureUnwrappedException();
    }

    public valueOr<TDefaultValue>(defaultValue: TDefaultValue): TValue | TDefaultValue {
        if (this.isSuccess()) {
            return this.value;
        }

        return defaultValue;
    }

    public abstract map<TNextValue>(action: (value: TValue) => TNextValue): Result<TNextValue, TError>;

    public abstract mapError<TNextError extends IBaseError>(action: (error: TError) => TNextError): Result<TValue, TNextError>;

    public abstract mapAsync<TNextValue>(action: (value: TValue) => Promise<TNextValue>): AsyncResult<TNextValue, TError>;

    public abstract mapErrorAsync<TNextError extends IBaseError>(action: (error: TError) => Promise<TNextError>): AsyncResult<TValue, TNextError>;

    public abstract onSuccess<TNextValue, TNextError extends IBaseError>(
        action: (value: TValue) => Result<TNextValue, TNextError>,
    ): Result<TNextValue, TError | TNextError>;

    public abstract onFailure<TNextValue, TNextError extends IBaseError>(
        action: (error: TError) => Result<TNextValue, TNextError>,
    ): Result<TValue | TNextValue, TNextError>;

    public abstract onSuccessAsync<TNextValue, TNextError extends IBaseError>(
        action: (value: TValue) => Promise<Result<TNextValue, TNextError>>,
    ): AsyncResult<TNextValue, TError | TNextError>;

    public abstract onFailureAsync<TNextValue, TNextError extends IBaseError>(
        action: (error: TError) => Promise<Result<TNextValue, TNextError>>,
    ): AsyncResult<TValue | TNextValue, TNextError>;

    public abstract tap(action: (value: TValue) => void): Result<TValue, TError>;

    public abstract tapError(action: (error: TError) => void): Result<TValue, TError>;

    public abstract tapAsync(action: (value: TValue) => Promise<void>): AsyncResult<TValue, TError>;

    public abstract tapErrorAsync(action: (error: TError) => Promise<void>): AsyncResult<TValue, TError>;

    public abstract match<TReturn>(actions: { success: (value: TValue) => TReturn; failure: (error: TError) => TReturn }): TReturn;
}

class Success<TValue> extends Result<TValue, never> {
    constructor(public readonly value: TValue) {
        super(true);
    }

    public map<TNextValue>(action: (value: TValue) => TNextValue): Result<TNextValue, never> {
        return Result.success(action(this.value));
    }

    public mapError<TNextError extends IBaseError>(_: (error: never) => TNextError): Result<TValue, TNextError> {
        return Result.success(this.value);
    }

    public mapAsync<TNextValue>(action: (value: TValue) => Promise<TNextValue>): AsyncResult<TNextValue, never> {
        return AsyncResult.of(action(this.value).then((value) => Result.success(value)));
    }

    public mapErrorAsync<TNextError extends IBaseError>(_: (error: never) => Promise<TNextError>): AsyncResult<TValue, TNextError> {
        return AsyncResult.of(Promise.resolve(Result.success(this.value)));
    }

    public onSuccess<TNextValue, TNextError extends IBaseError>(
        action: (value: TValue) => Result<TNextValue, TNextError>,
    ): Result<TNextValue, TNextError> {
        return action(this.value);
    }

    public onFailure<TNextValue, TNextError extends IBaseError>(
        _: (error: never) => Result<TNextValue, TNextError>,
    ): Result<TValue | TNextValue, TNextError> {
        return Result.success(this.value);
    }

    public onSuccessAsync<TNextValue, TNextError extends IBaseError>(
        action: (value: TValue) => Promise<Result<TNextValue, TNextError>>,
    ): AsyncResult<TNextValue, TNextError | never> {
        return AsyncResult.of(action(this.value));
    }

    public onFailureAsync<TNextValue, TNextError extends IBaseError>(
        _: (error: never) => Promise<Result<TNextValue, TNextError>>,
    ): AsyncResult<TValue | TNextValue, TNextError> {
        return AsyncResult.of(Promise.resolve(Result.success(this.value)));
    }

    public tap(action: (value: TValue) => void): Result<TValue, never> {
        action(this.value);

        return Result.success(this.value);
    }

    public tapError(_: (error: never) => void): Result<TValue, never> {
        return Result.success(this.value);
    }

    public tapAsync(action: (value: TValue) => Promise<void>): AsyncResult<TValue, never> {
        return AsyncResult.of(action(this.value).then(() => Result.success(this.value)));
    }

    public tapErrorAsync(_: (error: never) => Promise<void>): AsyncResult<TValue, never> {
        return AsyncResult.of(Promise.resolve(Result.success(this.value)));
    }

    public match<TReturn>(actions: { success: (value: TValue) => TReturn; failure: (error: never) => TReturn }): TReturn {
        return actions.success(this.value);
    }
}

class Failure<TError extends IBaseError> extends Result<never, TError> {
    constructor(public readonly error: TError) {
        super(false);
    }

    public map<TNextValue>(_: (value: never) => TNextValue): Result<TNextValue, TError> {
        return Result.failure(this.error);
    }

    public mapError<TNextError extends IBaseError>(action: (error: TError) => TNextError): Result<never, TNextError> {
        return Result.failure(action(this.error));
    }

    public mapAsync<TNextValue>(_: (value: never) => Promise<TNextValue>): AsyncResult<TNextValue, TError> {
        return AsyncResult.of(Promise.resolve(Result.failure(this.error)));
    }

    public mapErrorAsync<TNextError extends IBaseError>(action: (error: TError) => Promise<TNextError>): AsyncResult<never, TNextError> {
        return AsyncResult.of(action(this.error).then((error) => Result.failure(error)));
    }

    public onSuccess<TNextValue, TNextError extends IBaseError>(
        _: (value: never) => Result<TNextValue, TNextError>,
    ): Result<TNextValue, TError | TNextError> {
        return Result.failure(this.error);
    }

    public onFailure<TNextValue, TNextError extends IBaseError>(
        action: (error: TError) => Result<TNextValue, TNextError>,
    ): Result<never | TNextValue, TNextError> {
        return action(this.error);
    }

    public onSuccessAsync<TNextValue, TNextError extends IBaseError>(
        _: (value: never) => Promise<Result<TNextValue, TNextError>>,
    ): AsyncResult<TNextValue, TError | TNextError> {
        return AsyncResult.of(Promise.resolve(Result.failure(this.error)));
    }

    public onFailureAsync<TNextValue, TNextError extends IBaseError>(
        action: (error: TError) => Promise<Result<TNextValue, TNextError>>,
    ): AsyncResult<never | TNextValue, TNextError> {
        return AsyncResult.of(action(this.error));
    }

    public tap(_: (value: never) => void): Result<never, TError> {
        return Result.failure(this.error);
    }

    public tapError(action: (error: TError) => void): Result<never, TError> {
        action(this.error);

        return Result.failure(this.error);
    }

    public tapAsync(_: (value: never) => Promise<void>): AsyncResult<never, TError> {
        return AsyncResult.of(Promise.resolve(Result.failure(this.error)));
    }

    public tapErrorAsync(action: (error: TError) => Promise<void>): AsyncResult<never, TError> {
        return AsyncResult.of(action(this.error).then(() => Result.failure(this.error)));
    }

    public match<TReturn>(actions: { success: (value: never) => TReturn; failure: (error: TError) => TReturn }): TReturn {
        return actions.failure(this.error);
    }
}

export class AsyncResult<TValue, TError extends IBaseError> implements PromiseLike<Result<TValue, TError>> {
    public static of<TValue, TError extends IBaseError>(result: Promise<Result<TValue, TError>>): AsyncResult<TValue, TError> {
        return new AsyncResult(result);
    }

    public static ofSync<TValue, TError extends IBaseError>(result: Result<TValue, TError>): AsyncResult<TValue, TError> {
        return new AsyncResult(Promise.resolve(result));
    }

    public static success(): AsyncResult<void, never>;
    public static success<TValue>(value: TValue): AsyncResult<TValue, never>;
    public static success<TValue>(value?: TValue): AsyncResult<TValue, never> {
        return new AsyncResult(Promise.resolve(new Success(value as TValue)));
    }

    public static failure<TError extends IBaseError>(error: TError): AsyncResult<never, TError> {
        return new AsyncResult(Promise.resolve(new Failure(error)));
    }

    constructor(private readonly _promisedResult: Promise<Result<TValue, TError>>) {}

    public then<TResolved = Result<TValue, TError>, TRejected = never>(
        onfulfilled?: ((value: Result<TValue, TError>) => TResolved | PromiseLike<TResolved>) | undefined | null,
        onrejected?: ((reason: unknown) => TRejected | PromiseLike<TRejected>) | undefined | null,
    ): Promise<TResolved | TRejected> {
        return this._promisedResult.then(onfulfilled, onrejected);
    }

    public map<TNextValue>(action: (value: TValue) => TNextValue): AsyncResult<TNextValue, TError> {
        return AsyncResult.of(this._promisedResult.then((result) => result.map(action)));
    }

    public mapError<TNextError extends IBaseError>(action: (error: TError) => TNextError): AsyncResult<TValue, TNextError> {
        return AsyncResult.of(this._promisedResult.then((result) => result.mapError(action)));
    }

    public mapAsync<TNextValue>(action: (value: TValue) => Promise<TNextValue>): AsyncResult<TNextValue, TError> {
        return AsyncResult.of(this._promisedResult.then((result) => result.mapAsync(action)._promisedResult));
    }

    public mapErrorAsync<TNextError extends IBaseError>(action: (error: TError) => Promise<TNextError>): AsyncResult<TValue, TNextError> {
        return AsyncResult.of(this._promisedResult.then((result) => result.mapErrorAsync(action)._promisedResult));
    }

    public onSuccess<TNextValue, TNextError extends IBaseError>(
        action: (value: TValue) => Result<TNextValue, TNextError>,
    ): AsyncResult<TNextValue, TError | TNextError> {
        return AsyncResult.of(this._promisedResult.then((result) => result.onSuccess(action)));
    }

    public onFailure<TNextValue, TNextError extends IBaseError>(
        action: (error: TError) => Result<TNextValue, TNextError>,
    ): AsyncResult<TValue | TNextValue, TNextError> {
        return AsyncResult.of(this._promisedResult.then((result) => result.onFailure(action)));
    }

    public onSuccessAsync<TNextValue, TNextError extends IBaseError>(
        action: (value: TValue) => Promise<Result<TNextValue, TNextError>>,
    ): AsyncResult<TNextValue, TError | TNextError> {
        return AsyncResult.of(this._promisedResult.then((result) => result.onSuccessAsync(action)._promisedResult));
    }

    public onFailureAsync<TNextValue, TNextError extends IBaseError>(
        action: (error: TError) => Promise<Result<TNextValue, TNextError>>,
    ): AsyncResult<TValue | TNextValue, TNextError> {
        return AsyncResult.of(this._promisedResult.then((result) => result.onFailureAsync(action)._promisedResult));
    }

    public tap(action: (value: TValue) => void): AsyncResult<TValue, TError> {
        return AsyncResult.of(this._promisedResult.then((result) => result.tap(action)));
    }

    public tapError(action: (error: TError) => void): AsyncResult<TValue, TError> {
        return AsyncResult.of(this._promisedResult.then((result) => result.tapError(action)));
    }

    public tapAsync(action: (value: TValue) => Promise<void>): AsyncResult<TValue, TError> {
        return AsyncResult.of(this._promisedResult.then((result) => result.tapAsync(action)._promisedResult));
    }

    public tapErrorAsync(action: (error: TError) => Promise<void>): AsyncResult<TValue, TError> {
        return AsyncResult.of(this._promisedResult.then((result) => result.tapErrorAsync(action)._promisedResult));
    }
}

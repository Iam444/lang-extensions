import { AbstractInternalSystemException } from '../errors/index.js';
import type { TConstructor } from '../types/index.js';

export function isConstructor<TCtor, TInst extends object = TCtor extends TConstructor<infer TInferredInst> ? TInferredInst : never>(
    value: TCtor,
): value is Extract<TCtor, TConstructor<TInst>> {
    return !!value && typeof value === 'function' && value?.prototype?.constructor === value;
}

export function assertDefined<T>(value: T, exception: AbstractInternalSystemException): asserts value is NonNullable<T> {
    if (value == null) {
        throw exception;
    }
}

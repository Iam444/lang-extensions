import type { TConstructor, IEquatable } from '../types/index.js';

export class ExtendedTypeGuards {
    public static isCtor<TCtor, TInst extends object = TCtor extends TConstructor<infer TInferredInst> ? TInferredInst : never>(
        value: TCtor,
    ): value is Extract<TCtor, TConstructor<TInst>> {
        return !!value && typeof value === 'function' && value?.prototype.constructor === value;
    }

    public static isEquatable<T>(value: T): value is Extract<T, IEquatable<unknown>> {
        return !!value && typeof value === 'object' && 'equals' in value && typeof value.equals === 'function';
    }
}

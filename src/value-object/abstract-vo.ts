import type { IEquatable, TScalar, TConstructor } from '../types/index.js';

export abstract class AbstractVO implements IEquatable<AbstractVO> {
    public static of<C extends TConstructor<T>, T extends AbstractVO = C extends TConstructor<infer T> ? T : never>(
        this: C,
        ...args: ConstructorParameters<typeof this>
    ): T {
        const instance = new this(...args);

        instance.validate();

        return instance;
    }

    public equals<T extends AbstractVO>(other: T): boolean {
        if (this.constructor !== other.constructor) {
            return false;
        }

        return this.toScalar() === other.toScalar();
    }

    public abstract toString(): string;

    public abstract toScalar(): TScalar;

    protected abstract validate(): void;
}

import type { IEquatable, TConstructor, TPredicate } from '../types/index.js';

export abstract class AbstractList<T extends IEquatable<T>> {
    protected constructor(protected _items: T[]) {}

    get size(): number {
        return this._items.length;
    }

    get isEmpty(): boolean {
        return this._items.length === 0;
    }

    /**
     * Returns a shallow-copied Array
     */
    public asArray(): T[] {
        return [...this._items];
    }

    public clear(): void {
        this._items = [];
    }

    public contains(element: T): boolean {
        return this._items.some((item) => item.equals(element));
    }

    public exists(match: TPredicate<T>): boolean {
        return this._items.some(match);
    }

    public find(match: TPredicate<T>): T | null {
        return this._items.find(match) ?? null;
    }

    public filter(match: TPredicate<T>): this {
        const items = this._items.filter(match);
        const Constructor = this.constructor as TConstructor<this>;

        return new Constructor(items);
    }
}

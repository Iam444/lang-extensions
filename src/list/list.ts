import { AbstractList } from './abstract-list.js';
import type { IEquatable } from '../types/index.js';

/**
 * Represents a wrapper of Array with following characteristic:
 * - All items implement IEquatable
 * - Can contain NON-UNIQUE items
 * - Values' equality is determined by 'equals' method of IEquatable
 * - Is designed as an UNORDERED list for external usage
 */
export class List<T extends IEquatable<T>> extends AbstractList<T> {
    public static of<T extends IEquatable<T>>(elements: T[]): List<T> {
        return new List<T>(elements);
    }

    public static empty<T extends IEquatable<T>>(): List<T> {
        return new List<T>([]);
    }

    public add(item: T): void {
        this._items.push(item);
    }

    public removeOne(element: T): void {
        const index = this._items.findIndex((item) => item.equals(element));

        if (index === -1) {
            return;
        }

        this._items.splice(index, 1);
    }

    public removeAll(element: T): void {
        this._items = this._items.filter((item) => !item.equals(element));
    }

    private _getEntryIndexes(element: T): number[] | null {
        const entryIndexes: number[] = [];

        for (const [index, item] of this._items.entries()) {
            if (item.equals(element)) {
                entryIndexes.push(index);
            }
        }

        return entryIndexes.length === 0 ? null : entryIndexes;
    }
}

import { Result } from '../result/index.js';
import { IndexOutOfRangeError } from '../errors/index.js';
import { AbstractOrderedList } from './abstract-ordered-list.js';
import type { IEquatable, IIndexOutOfRangeError } from '../types/index.js';

/**
 * Represents a wrapper of Array with following characteristic:
 * - All items implement IEquatable
 * - Can contain NON-UNIQUE items
 * - Values' equality is determined by 'equals' method of IEquatable
 * - Is explicitly ORDERED and provides methods for working with the items' serial numbers
 */
export class OrderedList<T extends IEquatable<T>> extends AbstractOrderedList<T> {
    public static of<T extends IEquatable<T>>(elements: T[]): OrderedList<T> {
        return new OrderedList<T>(elements);
    }

    public static empty<T extends IEquatable<T>>(): OrderedList<T> {
        return new OrderedList<T>([]);
    }

    public add(item: T): void {
        this._items.push(item);
    }

    public override placeAt(element: T, index: number): Result<void, IIndexOutOfRangeError> {
        if (!this._isInRange(index)) {
            return Result.failure(
                IndexOutOfRangeError.of('Not able to place element. The provided index is out of the list range', index, this.size),
            );
        }

        this._items.splice(index, 0, element);

        return Result.success();
    }

    public removeFirst(element: T): void {
        const index = this._items.findIndex((item) => item.equals(element));

        if (index === -1) {
            return;
        }

        this._items.splice(index, 1);
    }

    public removeLast(element: T): void {
        const entryIndexes = this._getEntryIndexes(element);

        if (entryIndexes === null) {
            return;
        }

        const index = entryIndexes.at(-1)!;

        this._items.splice(index, 1);
    }

    public removeAll(element: T): void {
        this._items = this._items.filter((item) => !item.equals(element));
    }

    public getLastPosition(element: T): number | null {
        const entryIndexes = this._getEntryIndexes(element);

        if (entryIndexes === null) {
            return null;
        }

        return entryIndexes.at(-1)!;
    }

    public getAllPositions(element: T): number[] | null {
        const entryIndexes = this._getEntryIndexes(element);

        if (entryIndexes === null) {
            return null;
        }

        return entryIndexes;
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

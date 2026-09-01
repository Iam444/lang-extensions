import { Result } from '../result/index.js';
import { OrderOutOfRangeError } from '../errors/index.js';
import { Order } from './order.js';
import { AbstractOrderedList } from './abstract-ordered-list.js';
import type { IEquatable, IOrderOutOfRangeError } from '../types/index.js';

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

    public placeAt(element: T, position: Order): Result<void, IOrderOutOfRangeError> {
        if (!this._isInRange(position)) {
            return Result.failure(OrderOutOfRangeError.of(position.value, this.size));
        }

        this._items.splice(position.toIndex(), 0, element);

        return Result.success();
    }

    public removeAll(element: T): void {
        this._items = this._items.filter((item) => !item.equals(element));
    }

    public getLastPosition(element: T): Order | null {
        const entryIndexes = this._getEntryIndexes(element);

        if (entryIndexes === null) {
            return null;
        }

        const position = entryIndexes.at(-1)!;

        return new Order(position);
    }

    public getAllPositions(element: T): Order[] | null {
        const entryIndexes = this._getEntryIndexes(element);

        if (entryIndexes === null) {
            return null;
        }

        return entryIndexes.map((index) => new Order(index + 1));
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

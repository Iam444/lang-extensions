import { Result } from '../result/index.js';
import { DuplicatedElementError, IndexOutOfRangeError } from '../errors/index.js';
import { AbstractOrderedList } from './abstract-ordered-list.js';
import type { IDuplicatedElementError, IEquatable, IIndexOutOfRangeError } from '../types/index.js';

/**
 * Represents a wrapper of Array with following characteristic:
 * - All items implement IEquatable
 * - Can contain ONLY UNIQUE items
 * - Values' equality is determined by 'equals' method of IEquatable
 * - Is explicitly ORDERED and provides methods for working with the items' serial numbers
 */
export class Series<T extends IEquatable<T>> extends AbstractOrderedList<T> {
    public static reconstitute<T extends IEquatable<T>>(elements: T[]): Series<T> {
        return new Series(elements);
    }

    public static of<T extends IEquatable<T>>(elements: T[]): Result<Series<T>, IDuplicatedElementError<T>> {
        const series = new Series<T>([]);

        for (const element of elements) {
            const origin = series.find((item) => element.equals(item));

            if (origin) {
                return Result.failure(DuplicatedElementError.of(element));
            }

            series._items.push(element);
        }

        return Result.success(series);
    }

    public static empty<T extends IEquatable<T>>(): Series<T> {
        return new Series<T>([]);
    }

    public add(element: T): Result<void, IDuplicatedElementError<T>> {
        const origin = this.find((item) => element.equals(item));

        if (origin) {
            return Result.failure(DuplicatedElementError.of(element));
        }

        this._items.push(element);

        return Result.success();
    }

    public override placeAt(element: T, index: number): Result<void, IIndexOutOfRangeError | IDuplicatedElementError<T>> {
        if (!this._isInRange(index)) {
            return Result.failure(
                IndexOutOfRangeError.of('Not able to place element. The provided index is out of the list range', index, this.size),
            );
        }

        const origin = this.find((item) => element.equals(item));

        if (origin) {
            return Result.failure(DuplicatedElementError.of(element));
        }

        this._items.splice(index, 0, element);

        return Result.success();
    }

    public remove(element: T): void {
        const index = this._items.findIndex((item) => item.equals(element));

        if (index === -1) {
            return;
        }

        this._items.splice(index, 1);
    }
}

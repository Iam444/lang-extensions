import { Result } from '../result/index.js';
import { DuplicatedElementError } from '../errors/index.js';
import { AbstractList } from './abstract-list.js';
import type { IDuplicatedElementError, IEquatable } from '../types/index.js';

/**
 * Represents a wrapper of Array with following characteristic:
 * - All items implement IEquatable
 * - Can contain ONLY UNIQUE items
 * - Values equality is determined by 'equals' method of IEquatable
 * - Is designed as an UNORDERED list for external usage
 */
export class Collection<T extends IEquatable<T>> extends AbstractList<T> {
    public static reconstitute<T extends IEquatable<T>>(elements: T[]): Collection<T> {
        return new Collection(elements);
    }

    public static of<T extends IEquatable<T>>(elements: T[]): Result<Collection<T>, IDuplicatedElementError<T>> {
        const collection = new Collection<T>([]);

        for (const element of elements) {
            const origin = collection.find((item) => element.equals(item));

            if (origin) {
                return Result.failure(DuplicatedElementError.of(element));
            }

            collection._items.push(element);
        }

        return Result.success(collection);
    }

    public static empty<T extends IEquatable<T>>(): Collection<T> {
        return new Collection<T>([]);
    }

    public add(element: T): Result<void, IDuplicatedElementError<T>> {
        const origin = this.find((item) => element.equals(item));

        if (origin) {
            return Result.failure(DuplicatedElementError.of(element));
        }

        this._items.push(element);

        return Result.success();
    }

    public remove(element: T): void {
        this._items = this._items.filter((item) => !item.equals(element));
    }
}

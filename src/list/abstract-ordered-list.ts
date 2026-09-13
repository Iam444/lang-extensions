import { Result } from '../result/index.js';
import { IndexOutOfRangeError } from '../errors/index.js';
import { AbstractList } from './abstract-list.js';
import type { IBaseError, IEquatable, IIndexOutOfRangeError } from '../types/index.js';

export abstract class AbstractOrderedList<T extends IEquatable<T>> extends AbstractList<T> {
    get first(): T | null {
        return this._items.at(0) ?? null;
    }

    get last(): T | null {
        return this._items.at(-1) ?? null;
    }

    public clip(): void {
        this._items.pop();
    }

    public get(index: number): T | null {
        const element = this._items.at(index);

        return element || null;
    }

    public getIndex(element: T): number | null {
        const index = this._items.findIndex((item) => item.equals(element));

        return index === -1 ? null : index;
    }

    public removeAt(index: number): Result<void, IIndexOutOfRangeError> {
        if (!this._isInRange(index)) {
            return Result.failure(
                IndexOutOfRangeError.of('Not able to remove element. The provided index is out of the list range', index, this.size),
            );
        }

        this._items.splice(index, 1);

        return Result.success();
    }

    public reorder(sourceIndex: number, targetIndex: number): Result<void, IIndexOutOfRangeError> {
        if (sourceIndex === targetIndex) {
            return Result.success();
        }

        const sourceElement = this._items.at(sourceIndex);

        if (!sourceElement) {
            return Result.failure(
                IndexOutOfRangeError.of('Not able to reorder elements. The source index is out of the list range', sourceIndex, this.size),
            );
        }

        if (!this._isInRange(targetIndex)) {
            return Result.failure(
                IndexOutOfRangeError.of('Not able to reorder elements. The target index is out of the list range', targetIndex, this.size),
            );
        }

        if (sourceElement)
            this._items =
                sourceIndex < targetIndex
                    ? [
                          ...this._items.slice(0, sourceIndex),
                          ...this._items.slice(sourceIndex + 1, targetIndex + 1),
                          sourceElement,
                          ...this._items.slice(targetIndex + 1),
                      ]
                    : [
                          ...this._items.slice(0, targetIndex),
                          sourceElement,
                          ...this._items.slice(targetIndex, sourceIndex),
                          ...this._items.slice(sourceIndex + 1),
                      ];

        return Result.success();
    }

    protected _isInRange(index: number): boolean {
        return index >= 0 && index < this.size;
    }

    public abstract placeAt(element: T, index: number): Result<void, IBaseError>;
}

import { Result } from '../result/index.js';
import { OrderOutOfRangeError } from '../errors/index.js';
import { AbstractList } from './abstract-list.js';
import { Order } from './order.js';
import type { IBaseError, IEquatable, IOrderOutOfRangeError } from '../types/index.js';

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

    public get(position: Order): Result<T, IOrderOutOfRangeError> {
        const element = this._items.at(position.toIndex());

        if (!element) {
            return Result.failure(OrderOutOfRangeError.of(position.value, this.size));
        }

        return Result.success(element);
    }

    public getPosition(element: T): Order | null {
        const index = this._items.findIndex((item) => item.equals(element));

        return index === -1 ? null : new Order(index + 1);
    }

    public removeFrom(position: Order): Result<void, IOrderOutOfRangeError> {
        if (!this._isInRange(position)) {
            return Result.failure(OrderOutOfRangeError.of(position.value, this.size));
        }

        this._items.splice(position.toIndex(), 1);

        return Result.success();
    }

    public reorder(sourcePosition: Order, targetPosition: Order): Result<void, IOrderOutOfRangeError> {
        if (sourcePosition.equals(targetPosition)) {
            return Result.success();
        }

        const sourceElement = this._items.at(sourcePosition.toIndex());

        if (!sourceElement) {
            return Result.failure(OrderOutOfRangeError.of(sourcePosition.value, this.size));
        }

        if (!this._isInRange(targetPosition)) {
            return Result.failure(OrderOutOfRangeError.of(targetPosition.value, this.size));
        }

        this._items.splice(sourcePosition.toIndex(), 1);
        this._items.splice(targetPosition.toIndex(), 0, sourceElement);

        return Result.success();
    }

    protected _isInRange(position: Order): boolean {
        return position.value <= this.size;
    }

    public abstract placeAt(element: T, position: Order): Result<void, IBaseError>;
}

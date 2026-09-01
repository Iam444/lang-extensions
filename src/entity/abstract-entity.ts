import type { IEquatable } from '../types/index.js';
import type { AbstractID } from '../identity/index.js';

export abstract class AbstractEntity<TId extends AbstractID> implements IEquatable<AbstractEntity<TId>> {
    protected constructor(protected readonly _id: TId) {}

    get id(): TId {
        return this._id;
    }

    public toString(): string {
        return `${this.constructor.name}(${this._id.toString()})`;
    }

    public equals(other: AbstractEntity<TId>): boolean {
        return this._id.equals(other._id);
    }
}

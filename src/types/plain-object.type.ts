import type { TScalar } from './scalar.type.js';

export type TPlainObject = { [K: string]: TScalar | TPlainObject | TScalar[] | TPlainObject[] };

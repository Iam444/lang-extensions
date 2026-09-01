import type { TScalar } from './scalar.type.js';

export type TDefinedScalar = Exclude<TScalar, undefined>;

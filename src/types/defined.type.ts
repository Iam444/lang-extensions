import type { TBase } from './base.type.js';

export type TDefined = Exclude<TBase, undefined>;

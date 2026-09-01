// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TConstructor<TReturn extends object, TParameters extends any[] = any[]> = new (...parameters: TParameters) => TReturn;

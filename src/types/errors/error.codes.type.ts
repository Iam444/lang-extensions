import { ErrorCodes } from '../../errors/index.js';

export type TErrorCodes = (typeof ErrorCodes)[keyof typeof ErrorCodes];

import { v4, validate } from 'uuid';

interface ISetupOptions {
    generator: () => string;
    validator: (uuidString: string) => boolean;
}

export class UUIDGenerator {
    private static generator: ISetupOptions['generator'] | null = v4;
    private static validator: ISetupOptions['validator'] | null = validate;

    public static isValid(uuidString: string): boolean {
        if (!this.validator) {
            throw new Error('"UUIDGenerator" is not configured. Use "UUIDGenerator.setup()" in bootstrapping part of your application.');
        }

        return this.validator(uuidString);
    }

    public static generate(): string {
        if (!this.generator) {
            throw new Error('"UUIDGenerator" is not configured. Use "UUIDGenerator.setup()" in bootstrapping part of your application.');
        }

        return this.generator();
    }

    public static setup(options: ISetupOptions): void {
        this.generator = options.generator;
        this.validator = options.validator;
    }

    public static reset(): void {
        this.generator = null;
        this.validator = null;
    }
}

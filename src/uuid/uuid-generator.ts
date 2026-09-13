import { v4, validate } from 'uuid';

interface ISetupOptions {
    generator: () => string;
    validator: (uuidString: string) => boolean;
}

export class UUIDGenerator {
    private static generator: ISetupOptions['generator'] = v4;
    private static validator: ISetupOptions['validator'] = validate;

    public static isValid(uuidString: string): boolean {
        return this.validator(uuidString);
    }

    public static generate(): string {
        return this.generator();
    }

    public static setup(options: ISetupOptions): void {
        this.generator = options.generator;
        this.validator = options.validator;
    }

    public static reset(): void {
        this.generator = v4;
        this.validator = validate;
    }
}

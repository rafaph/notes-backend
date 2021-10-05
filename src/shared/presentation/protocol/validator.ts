export interface Validator<T = unknown> {
    validate(input: T): Promise<Error | undefined>
}

export interface Decrypter<T = unknown> {
    decrypt(value: string): Promise<T | undefined>;
}

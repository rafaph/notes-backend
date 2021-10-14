export interface Decrypter<T = { id: string }> {
    decrypt(value: string): Promise<T | undefined>;
}

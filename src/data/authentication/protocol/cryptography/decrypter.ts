export interface Decrypter {
    decrypt(value: string): Promise<unknown | undefined>;
}

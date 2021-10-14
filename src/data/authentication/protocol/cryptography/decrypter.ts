export interface Decrypter {
    decrypt(value: string): Promise<Record<string, unknown>>;
}


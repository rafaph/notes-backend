export interface IHashingHasher {
    hash(value: string): Promise<string>;
}

export interface IHashingVerifier {
    verify(hash: string, plain: string): Promise<boolean>;
}

export interface IHashing extends IHashingHasher, IHashingVerifier {}

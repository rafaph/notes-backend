export interface IHasher {
    hash(value: string): Promise<string>;
}

export interface IHashVerifier {
    verify(hash: string, plain: string): Promise<boolean>;
}

export interface IHashing extends IHasher, IHashVerifier {}

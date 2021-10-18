export interface ITokenManagerSigner {
    sign(value: string): Promise<string>;
}

export interface ITokenManagerVerifier {
    verify(token: string): Promise<string>;
}

export interface ITokenManager extends ITokenManagerSigner, ITokenManagerVerifier {}

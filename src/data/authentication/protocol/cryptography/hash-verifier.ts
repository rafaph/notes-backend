export interface HashVerifier {
    verify(hash: string, plain: string): Promise<boolean>;
}

export interface UpdateAccessTokenRepository {
    updateToken(id: string, token: string): Promise<void>;
}

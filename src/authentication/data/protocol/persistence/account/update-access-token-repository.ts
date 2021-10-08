export interface UpdateAccessTokenRepository {
    updateAccessToken(input: UpdateAccessTokenRepository.Input): Promise<UpdateAccessTokenRepository.Output>;
}

export namespace UpdateAccessTokenRepository {
    export interface Input {
        id: string;
        accessToken: string;
    }

    export type Output = void;
}

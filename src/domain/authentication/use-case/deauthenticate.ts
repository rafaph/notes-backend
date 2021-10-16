export interface Deauthenticate {
    execute(input: Deauthenticate.Input): Promise<Deauthenticate.Output>;
}

export namespace Deauthenticate {
    export interface Input {
        id: string;
    }
    export type Output = boolean;
}

export interface Authenticate {
    execute(input: Authenticate.Input): Promise<Authenticate.Output>;
}

export namespace Authenticate {
    export interface Input {
        email: string;
        password: string;
    }

    export type Output = string;
}

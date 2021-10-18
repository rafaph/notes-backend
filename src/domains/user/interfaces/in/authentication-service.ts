export interface IAuthenticateAuthenticationService {
    authenticate(email: string, password: string): Promise<string>;
}

// eslint-disable-next-line
export interface IAuthenticationService extends IAuthenticateAuthenticationService {}

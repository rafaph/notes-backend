export interface IAuthenticateAuthenticationService {
    authenticate(email: string, password: string): Promise<string>;
}

export interface IDeauthenticateAuthenticationService {
    deauthenticate(id: string): Promise<void>;
}

// eslint-disable-next-line
export interface IAuthenticationService
    extends IAuthenticateAuthenticationService,
        IDeauthenticateAuthenticationService {}

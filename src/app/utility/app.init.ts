import { KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
    return (): Promise<any> =>
        keycloak.init(
            {
                config: {
                    url: 'http://10.50.1.25/auth/',
                    realm: 'cyberrange',
                    clientId: 'emo-client',
                    // onLoad: 'login-required',
                },
                initOptions: {
                    onLoad: 'login-required',
                    checkLoginIframe: false,
                    checkLoginIframeInterval: 25
                },
                loadUserProfileAtStartUp: true
            }
        );
}

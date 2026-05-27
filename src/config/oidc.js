import { Issuer } from 'openid-client';

let microsoftClient;

export const initializeOidc = async () => {
    try {
        if (process.env.MICROSOFT_CLIENT_ID) {
            const microsoftIssuer = await Issuer.discover('https://login.microsoftonline.com/' + process.env.MICROSOFT_TENANT_ID + '/v2.0');
            microsoftClient = new microsoftIssuer.Client({
                client_id: process.env.MICROSOFT_CLIENT_ID,
                client_secret: process.env.MICROSOFT_CLIENT_SECRET,
                redirect_uris: [process.env.MICROSOFT_REDIRECT_URI],
                response_types: ['code'],
            });
            console.log('Microsoft OIDC client initialized successfully.');
        } else {
            console.warn('MICROSOFT_CLIENT_ID not found in environment. Microsoft login will be disabled.');
        }
    } catch (error) {
        console.error('Failed to initialize OIDC clients:', error);
    }
};

export const getMicrosoftClient = () => {
    if (!microsoftClient) {
        throw new Error('Microsoft OIDC client is not initialized or configured.');
    }
    return microsoftClient;
};

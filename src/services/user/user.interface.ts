export type TUser = {
    uid: string;
    email: string;
    emailVerified: string;
    phoneNumber: string;
    password: string;
    displayName: string;
    photoURL: string;
    disabled: boolean;
    providerData: [{
        uid: string;
        displayName: string;
        email: string;
        photoURL: string;
        providerId: string;
        phoneNumber: string;
    }]
};

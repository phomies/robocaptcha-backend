type Name = {
    metadata: {
        primary: boolean;
        source: {
            type: string;
            id: string;
        };
    };
    displayName: string;
    givenName: string;
    displayNameLastFirst: string;
    unstructuredName: string;
};

type PhoneNumber = {
    metadata: {
        primary: boolean;
        source: {
            type: string;
            id: string;
        };
        sourcePrimary: boolean;
    };
    value: string;
    canonicalForm: string;
    type: string;
    formattedType: string;
};

export type Connection = {
    resourceName: string;
    etag: string;
    names: [Name];
    phoneNumbers: [PhoneNumber];
};

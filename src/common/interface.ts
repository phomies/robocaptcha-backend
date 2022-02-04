export type IUser = {
    id: string;
    name: string;
    password: string;
    email: string;
    dateJoined: Date;
    whitelist: [number];
    blacklist: [number];
};

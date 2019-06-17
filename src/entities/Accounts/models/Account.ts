export interface IAccount {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    ban: {
        until: string;
        isPermanent?: boolean;
    };
    registrationContext?: {
        ip: string;
    };
    extraInfo?: {
        [key: string]: string | number;
    };
}

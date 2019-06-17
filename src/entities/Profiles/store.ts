import { IAccount } from 'src/entities/Accounts/models/Account';

export interface IProfiles {
    [key: number]: IAccount;
}

export const profiles: IProfiles = {};

import { IReason } from 'src/types/IReason';

export interface IGameAccount {
    id: number;
    partnerId: string;
    login: string;
    created: string;
    lastLoginTime: string;
    ban?: IGameAccountBan;
    subscriptionUntil?: string;
    userAccount?: {
        userId: number;
    };
}

export interface IGameAccountBan {
    until: string;
    isPermanent?: boolean;
    reason: IReason;
}

import { IAccount } from 'src/entities/Accounts/models/Account';

export interface IContactHistoryEvent {
    userId?: number;
    addedDate?: string;
    deletedDate?: string;
    account?: IAccount;
}

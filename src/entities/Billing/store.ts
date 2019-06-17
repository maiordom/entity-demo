import { IBalance } from './models/Balance';
import { ITransaction } from './models/Transaction';

export interface IBilling {
    balance: {
        [key: string]: IBalance;
    };
    transactions: ITransactions;
}

export interface ITransactions {
    value: string;
    items: Array<ITransaction>;
    hasNextPage: boolean;
    count: number;
    from: number;
}

export const billing: IBilling = {
    balance: {},
    transactions: {
        value: null,
        items: null,
        hasNextPage: false,
        count: 100,
        from: 0
    }
};

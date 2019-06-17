export interface ITransactionRaw {
    id: number;
    type: string;
    amount: number;
    whenCreated: string;
    paymentId?: string;
    userId: string;
    createdBy: string;
    bonusId?: string;
}

export interface ITransaction extends ITransactionRaw {
    raw: any;
}

import { IGameAccount } from './models/GameAccount';
export { IGameAccount } from './models/GameAccount';

export type IGameAccounts = Array<IGameAccount>;

export interface IGameAuth {
    [key: string]: IGameAccounts;
}

export const gameAuth: IGameAuth = {};

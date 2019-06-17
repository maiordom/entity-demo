import { ILootBox } from './models/LootBox';

export interface IAbstractLootBoxes<T> {
    items: Array<T>;
    opened: {
        [id: number]: ILootBox;
    };
}

export type IAionLootBoxes = IAbstractLootBoxes<ILootBox>;

export interface ILootBoxes {
    aionLootBoxes: IAionLootBoxes;
    pbLootBoxes: IAionLootBoxes;
}

export const lootBoxes: ILootBoxes = {
    aionLootBoxes: {
        items: [],
        opened: {}
    },
    pbLootBoxes: {
        items: [],
        opened: {}
    }
};

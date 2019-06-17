import { IValue } from 'src/types/IValue';

export interface ILootBox {
    id?: any;
    slug: string;
    name: IValue;
    type: string;
    withdrawn: boolean;
    versions: Array<ILootBoxVersion>;
    components: Array<ILootBoxComponent>;
}

export interface ILootBoxVersion {
    name: IValue;
    id: any;
    price: number;
    quantity: number;
    isEnabled: boolean;
}

export interface ILootBoxComponent {
    id: any;
    probability: number;
    quantity: number;
    isMainPrize: boolean;
    name: {
        name: IValue;
        mainName?: IValue;
    };
    mainPrizeDescription?: {
        [lang: string]: {
            type: 'text';
            text: string;
        } | {
            type: 'data';
            properties: Array<{
                name: string;
                value: string;
            }>;
        }
    }
    description?: {
        [lang: string]: {
            isRealMainPrize: boolean;
            isTransportable: string;
            textDescription: {
                type: 'text';
                text: string;
            };
        };
    };
}
import { IEmission } from './models/Emission';

export interface IEmissions {
    emissions: Array<IEmission>;
    from: number;
    total: number;
}

export interface IPagination {
    count: number;
}

export interface ICodes {
    items: {
        [key: string]: IEmissions;
    };
    pagination: IPagination;
}

export const codes: ICodes = {
    items: {},
    pagination: {
        count: 10
    }
};

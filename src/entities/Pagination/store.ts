import { IOption } from 'ui/lib/Select';
export { IOption } from 'ui/lib/Select';

export interface IPerPageCountOption {
    items: Array<IOption>;
    selected: IOption;
}

export interface IPagination {
    perPageCountOptions: IPerPageCountOption;
}

const perPageCountOptions: IPerPageCountOption = {
    items: (() => {
        const options = [];

        for (let i = 1; i < 11; i++) {
            options.push({ id: i * 10, value: i * 10 });
        }

        return options;
    })(),
    selected: { id: 10, value: 10 }
};

export const pagination: IPagination = {
    perPageCountOptions
};

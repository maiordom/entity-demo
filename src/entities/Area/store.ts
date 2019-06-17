export interface IAreaItem {
    id: 'ru' | 'eu' | 'br';
    lang: 'ru' | 'en' | 'pt';
    value: string;
    currency: string;
    sign: string;
}

export interface IArea {
    items: Array<IAreaItem>;
    selected: IAreaItem;
}

const RU: IAreaItem = {
    id: 'ru',
    lang: 'ru',
    value: 'Россия',
    currency: 'rub',
    sign: '₽'
};

const EN: IAreaItem = {
    id: 'eu',
    lang: 'en',
    value: 'Европа',
    currency: 'eur',
    sign: '€'
};

const BR: IAreaItem = {
    id: 'br',
    lang: 'pt',
    value: 'Бразилия',
    currency: 'brl',
    sign: 'R$'
};

export const area: IArea = {
    items: [
        RU,
        EN,
        BR
    ],
    selected: RU
};

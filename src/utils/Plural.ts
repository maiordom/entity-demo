export const getNounPluralForm = (count: number) => {
    if (count % 10 === 1 && count % 100 !== 11) {
        return 0;
    } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
        return 1;
    } else {
        return 2;
    }
};

export const plural = (count: number, forms: Array<string>) => {
    return forms[getNounPluralForm(count)];
};

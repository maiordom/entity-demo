export interface IComponentProduct {
    type: 'product';
    productId: number;
    productQuantity: number;
}

export interface IComponentBonus {
    type: 'bonus';
    amount: number;
    currency: string;
}

export interface IComponentBetaTestingAccept {
    type: 'betaTestingAccept';
    betaTestingServiceId: string;
    betaTestingRequestType: 'private';
}

export interface IComponentDiscount {
    type: 'discount';
    discount: IDiscount;
}

export interface IDiscount {
    value: number;
    type: string;
}

export type ICodeComponents = Array<
    IComponentProduct |
    IComponentBetaTestingAccept |
    IComponentBonus |
    IComponentDiscount
>;

export type TComponent = IComponentProduct |
    IComponentBetaTestingAccept |
    IComponentBonus |
    IComponentDiscount;

export type TComponentType = 'product' | 'bonus' | 'betaTestingAccept' | 'discount';

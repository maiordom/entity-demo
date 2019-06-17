export interface IRestrictionTotalPromoCodeActivations {
    type: 'totalPromoCodeActivations';
    totalActivations: string;
}

export interface IRestrictionLifetime {
    type: 'lifetime';
    lifetimeUntil?: string;
    lifetimeFrom?: string;
}

export interface IRestrictionGroup {
    type: 'group';
    groupId: string;
    contain: boolean;
}

export type ICodeRestrictions = Array<
    IRestrictionTotalPromoCodeActivations |
    IRestrictionLifetime |
    IRestrictionGroup
>;

export type TRestriction = IRestrictionTotalPromoCodeActivations |
    IRestrictionLifetime |
    IRestrictionGroup;

export type TRestrictionType = 'lifetime' | 'totalPromoCodeActivations' | 'group';

import { createAction } from 'src/utils/CreateAction';

import { IStore } from 'src/store';
import { IClaim } from './models/Claim';
import { IOption } from 'src/entities/Apps/store';
import getClaimsService, { IGetClaimsResult, IGetClaimsRequestParams } from './services/GetClaims';
import getAllClaimsService, { IGetAllClaimsRequestParams } from './services/GetAllClaims';
export { IGetClaimsRequestParams, IGetClaimsResult } from './services/GetClaims';

import addClaimService, { IAddClaimRequestParams } from './services/AddClaim';
import deleteClaimService, {IDeleteClaimRequestParams } from './services/DeleteClaim';

import { filterApp } from 'src/entities/Apps/reducer';
import { getProfile } from 'src/entities/User/actions';

export interface ISetClaimsParams { claims: Array<IClaim>; userId: string; }
export interface ISetClaimsByServiceParams { checked: boolean, groupName: string, serviceKey: string; }
export interface ISetServiceClaimParams { checked: boolean, claim: string; groupName: string, serviceKey: string; }
export interface ISetServiceParams { option: IOption; }
export interface ISetGroupClaimsParams { checked: boolean; groupName: string; }
export interface ISetClaimServicesParams { checked: boolean; claimName: string; groupName: string; }

export const {
    setClaims,
    setClaimsByService,
    setServiceClaim,
    setClaimsDiff,
    setServices,
    setService,
    setGroupClaims,
    setClaimServices
} = {
    setClaims: (params: ISetClaimsParams) => createAction('setClaims', params),
    setClaimsByService: (params: ISetClaimsByServiceParams) => createAction('setClaimsByService', params),
    setServiceClaim: (params: ISetServiceClaimParams) => createAction('setServiceClaim', params),
    setClaimsDiff: () => createAction('setClaimsDiff'),
    setServices: () => createAction('setServices'),
    setService: (params: ISetServiceParams) => createAction('setService', params),
    setGroupClaims: (params) => createAction('setGroupClaims', params),
    setClaimServices: (params) => createAction('setClaimServices', params)
};

export const filterClaims = (res: IGetClaimsResult, state: IStore) => {
    const area = state.area.selected.id;
    const areasKeys = [ state.area.selected.id ];

    return res
        .filter(claim => claim.type !== 'role')
        .filter(claim => filterApp(claim.value, area, areasKeys));
};

export const getClaims = (params: IGetClaimsRequestParams) => async (dispatch, getState: () => IStore) => {
    const claims = await getClaimsService(params)

    return filterClaims(claims, getState());
};

export const getAllClaims = (params: IGetAllClaimsRequestParams) => async (dispatch, getState: () => IStore) => {
    const claims = await getAllClaimsService(params);

    return filterClaims(claims, getState());
};

export const addClaim = (params: IAddClaimRequestParams) =>
    addClaimService(params);

export const deleteClaim = (params: IDeleteClaimRequestParams) =>
    deleteClaimService(params);

export const applyUserClaims = () => async (dispatch, getState: () => IStore) => {
    dispatch(setClaimsDiff());

    const promises = [];

    const { userId: currentUserId } = getState().user.profile;
    const { userId } = getState().claims;
    const { newClaims, deletedClaims } = getState().claims;

    newClaims.forEach(claim => {
        promises.push(() => addClaim({ userId, claim: claim.type, value: claim.value }));
    });

    deletedClaims.forEach(claim => {
        promises.push(() => deleteClaim({ userId, claim: claim.type, value: claim.value }));
    });

    for (const promise of promises) {
        await promise();
    }

    if (userId === currentUserId) {
        dispatch(getProfile());
    }

    return Promise.resolve();
};

import { handleActions } from 'redux-actions';
import forEach from 'lodash/forEach';
import differenceWith from 'lodash/differenceWith';
import reject from 'lodash/reject';

import { IAction } from 'src/types/IAction';
import * as a from './actions';
import { IStore } from 'src/store';

import { IClaim } from 'src/entities/Claim/models/Claim';
import { IUserClaims } from 'src/entities/Claim/models/UserClaims';

import { filterApp } from 'src/entities/Apps/reducer';

export default handleActions({
    [a.setGroupClaims.name]: (state: IStore, { payload: { groupName, checked }}: IAction<a.ISetGroupClaimsParams>) => {
        state.claims = {...state.claims};
        state.claims.groups[groupName] = {...state.claims.groups[groupName]};

        if (checked) {
            state.claims.groups[groupName].claims.forEach(claim => {
                state.claims.claimsByType[claim.source] = Object.keys(state.claims.claimsByService);
                Object.keys(state.claims.claimsByService).forEach(service => {
                    const claimIndex = state.claims.claimsByService[service].indexOf(claim.source);
    
                    if (claimIndex === -1) {
                        state.claims.claimsByService[service].push(claim.source);
                    }
                });
            });
        } else {
            state.claims.groups[groupName].claims.forEach(({ source: claimName }) => {
                state.claims.claimsByType[claimName].forEach(service => {
                    state.claims.claimsByService[service] = reject(state.claims.claimsByService[service], (claim) => claim === claimName);
                });    
                state.claims.claimsByType[claimName] = [];
            });
        }

        return state;
    },

    [a.setClaimServices.name]: (state: IStore, { payload: { claimName, checked, groupName } }: IAction<a.ISetClaimServicesParams>) => {
        state.claims = {...state.claims};
        state.claims.groups[groupName] = {...state.claims.groups[groupName]};

        if (checked) {
            state.claims.claimsByType[claimName] = Object.keys(state.claims.claimsByService);
            Object.keys(state.claims.claimsByService).forEach(service => {
                const claimIndex = state.claims.claimsByService[service].indexOf(claimName);

                if (claimIndex === -1) {
                    state.claims.claimsByService[service].push(claimName);
                }
            });
        } else {
            state.claims.claimsByType[claimName].forEach(service => {
                state.claims.claimsByService[service] = reject(state.claims.claimsByService[service], (claim) => claim === claimName);
            });
            state.claims.claimsByType[claimName] = [];
        }

        return state;
    },

    [a.setService.name]: (state: IStore, { payload: { option }}: IAction<a.ISetServiceParams>) => {
        state.claims = {...state.claims};
        state.claims.claimsByService[option.id] = [];

        const claimsByService: IUserClaims = {};
        Object.keys(state.claims.claimsByService).sort((a, b) => {
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        }).forEach((key) => {
            claimsByService[key] = state.claims.claimsByService[key];
        });
        state.claims.claimsByService = claimsByService;
        state.claims.apps.items = reject(state.claims.apps.items, { id: option.id });

        return state;
    },

    [a.setServices.name]: (state: IStore) => {
        state.claims = {...state.claims};

        const services = Object.keys(state.claims.claimsByService);
        const area = state.area.selected.id;
        const areasKeys = [ state.area.selected.id ];

        const availableApps = Object
            .keys(state.apps)
            .filter(app => filterApp(app, area, areasKeys))
            .filter(app => !services.includes(app));

        state.claims.apps = {
            items: availableApps.map(app => ({
                id: state.apps[app].id,
                value: state.apps[app].name
            })),
            selected: null
        };

        return state;
    },

    [a.setClaimsDiff.name]: (state: IStore) => {
        const { claimsByType, claimsList } = state.claims;
        const userClaims: Array<IClaim> = [];

        forEach(claimsByType, (services, claim) => {
            services.forEach(service => {
                userClaims.push({
                    type: claim,
                    value: service
                });
            });
        });

        const diffWithIterator = (originClaim, currentClaim) =>
            originClaim.type === currentClaim.type && originClaim.value === currentClaim.value;

        const deletedClaims: Array<IClaim> = differenceWith(claimsList, userClaims, diffWithIterator);
        const newClaims: Array<IClaim> = differenceWith(userClaims, claimsList, diffWithIterator);

        state.claims.deletedClaims = deletedClaims;
        state.claims.newClaims = newClaims;

        return state;
    },

    [a.setServiceClaim.name]: (state: IStore, { payload: {
        checked,
        serviceKey,
        claim,
        groupName
    } }: IAction<a.ISetServiceClaimParams>) => {
        state.claims = {...state.claims};
        state.claims.groups[groupName] = {...state.claims.groups[groupName]};

        const { claimsByService, claimsByType } = state.claims;

        if (checked) {
            if (!claimsByService[serviceKey]) {
                claimsByService[serviceKey] = [claim];
            } else {
                claimsByService[serviceKey].push(claim);
            }

            if (!claimsByType[claim]) {
                claimsByType[claim] = [serviceKey];
            } else {
                claimsByType[claim].push(serviceKey);
            }
        } else {
            const claimIndexByService = claimsByService[serviceKey].indexOf(claim);
            const serviceIndexByType = claimsByType[claim].indexOf(serviceKey);

            claimsByService[serviceKey].splice(claimIndexByService, 1);
            claimsByType[claim].splice(serviceIndexByType, 1);
        }

        return state;
    },

    [a.setClaimsByService.name]: (state: IStore, { payload: {
        checked,
        serviceKey,
        groupName
    }}: IAction<a.ISetClaimsByServiceParams>) => {
        state.claims = {...state.claims};
        state.claims.groups[groupName] = {...state.claims.groups[groupName]};

        const groupClaims = state.claims.groups[groupName].claims;
        const { claimsByService, claimsByType } = state.claims;

        if (checked) {
            groupClaims.forEach(claim => {
                if (!claimsByService[serviceKey]) {
                    claimsByService[serviceKey] = [claim.source];
                } else if (!claimsByService[serviceKey].includes(claim.source)) {
                    claimsByService[serviceKey].push(claim.source);
                }

                if (!claimsByType[claim.source]) {
                    claimsByType[claim.source] = [serviceKey];
                } else if (!claimsByType[claim.source].includes(serviceKey)) {
                    claimsByType[claim.source].push(serviceKey);
                }
            });
        } else {
            groupClaims.forEach(claim => {
                const claimIndexByService = (claimsByService[serviceKey] || []).indexOf(claim.source);
 
                if (claimIndexByService !== -1) {
                    claimsByService[serviceKey].splice(claimIndexByService, 1);
                }

                const serviceIndexByType = (claimsByType[claim.source] || []).indexOf(serviceKey);

                if (serviceIndexByType !== -1) {
                    claimsByType[claim.source].splice(serviceIndexByType, 1);
                }
            });
        }

        return state;
    },

    [a.setClaims.name]: (state: IStore, { payload: { claims, userId } }: IAction<a.ISetClaimsParams>) => {
        state.claims = {...state.claims};

        const claimsByService: IUserClaims = {};
        const claimsByType: IUserClaims = {};

        claims = claims
            .sort((a, b) => {
                if (a.value < b.value) return -1;
                if (a.value > b.value) return 1;
                return 0;
            });

        claims.forEach(claim => {
            const { type, value } = claim;

            if (value in claimsByService) {
                claimsByService[value].push(type);
            } else {
                claimsByService[value] = [type];
            }

            if (type in claimsByType) {
                claimsByType[type].push(value);
            } else {
                claimsByType[type] = [value];
            }
        });

        state.claims = {
            groups: state.claims.groups,
            apps: {
                items: [],
                selected: null
            },
            newClaims: [],
            deletedClaims: [],
            userId: userId,
            claimsList: claims,
            claimsByType,
            claimsByService,
        };

        return state;
    }
}, {});

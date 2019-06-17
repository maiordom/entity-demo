import { createSelector } from 'reselect';
import * as difference from 'lodash/difference';
import * as find from 'lodash/find';

const permissionsSelector = (state) => ({
    djr: state.user.permissions['docs.juristics.read'],
    dpr: state.user.permissions['docs.patchnotes.read'],
    dwr: state.user.permissions['docs.webshop.read'],
    options: state.appsOptions.items
});

export interface IAllowedIds {
    djr: Array<string>,
    dpr: Array<string>,
    dwr: Array<string>
};
let previousPermissions: IAllowedIds = { djr: [], dpr: [], dwr: [] }
let previousResult: IAllowedIds = { djr: [], dpr: [], dwr: [] };

export const documentReadSelector = createSelector(
    permissionsSelector,
    (data) => {
        const { djr, dpr, dwr, options } = data;
        const updateResult: IAllowedIds = { dpr: null, djr: null, dwr: null };

        if (djr && difference(djr, previousPermissions.djr).length) {
            updateResult.djr = djr.filter((permission) => find(options, { id: permission }))
        }

        if (dpr && difference(dpr, previousPermissions.dpr).length) {
            updateResult.dpr = dpr.filter((permission) => find(options, { id: permission }))
        }

        if (dwr && difference(dwr, previousPermissions.dwr).length) {
            updateResult.dwr = dwr.filter((permission) => find(options, { id: permission }))
        }

        previousPermissions = { djr, dpr, dwr };

        if (updateResult.dpr || updateResult.djr || updateResult.dwr) {
            for (const key in updateResult) {
                if (updateResult[key] === null) {
                    updateResult[key] = []; 
                }
            }

            previousResult = { ...updateResult };

            return updateResult;
        }

        return previousResult;
    }
);

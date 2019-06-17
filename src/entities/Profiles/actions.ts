import { createAction } from 'src/utils/CreateAction';

import { IAccount } from 'src/entities/Accounts/models/Account';

export interface ISetProfilesParams { profiles: Array<IAccount>; }

export const {
    setProfiles
} = {
    setProfiles: (params: ISetProfilesParams) => createAction('setProfiles', params)
};

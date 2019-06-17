import { handleActions } from 'redux-actions';

import { IAction } from 'src/types/IAction';

import * as a from './actions';

import { IStore } from 'src/store';

export default handleActions({
    [a.setProfiles.name]: (state: IStore, { payload: { profiles } }: IAction<a.ISetProfilesParams>) => {
        profiles.forEach(profile => {
            state.profiles[profile.id] = profile;
        });

        state.profiles = {...state.profiles};

        return state;
    }
}, {});

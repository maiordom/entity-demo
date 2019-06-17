import resetEmailService, { IResetEmailRequestParams } from './services/ResetEmail';
export { IResetEmailRequestParams } from './services/ResetEmail';

import deletePhoneService, { IDeletePhoneRequestParams } from './services/DeletePhone';
export { IDeletePhoneRequestParams } from './services/DeletePhone';

import changeProfileService, { IChangeProfileRequestParams } from './services/ChangeProfile';
export { IChangeProfileRequestParams } from './services/ChangeProfile';

import banAccountService, { IBanAccountRequestParams } from './services/BanAccount';
export { IBanAccountRequestParams } from './services/BanAccount';

import unbanAccountService, { IUnbanAccountRequestParams } from './services/UnbanAccount';
export { IUnbanAccountRequestParams } from './services/UnbanAccount';

import getRegistrationContextService, { IGetRegistrationContextRequestParams } from './services/GetRegistrationContext';
export { IGetRegistrationContextRequestParams } from './services/GetRegistrationContext';

export const getRegistrationContext = (params: IGetRegistrationContextRequestParams) => () =>
    getRegistrationContextService(params);

export const resetEmail = (params: IResetEmailRequestParams) => () =>
    resetEmailService(params);

export const deletePhone = (params: IDeletePhoneRequestParams) => () =>
    deletePhoneService(params);

export const changeProfile = (params: IChangeProfileRequestParams) => () =>
    changeProfileService(params);

export const banAccount = (params: IBanAccountRequestParams) => () =>
    banAccountService(params);

export const unbanAccount = (params: IUnbanAccountRequestParams) => () =>
    unbanAccountService(params);

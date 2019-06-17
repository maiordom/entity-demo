import { createAction } from 'src/utils/CreateAction';

import { ILootBox, ILootBoxVersion, ILootBoxComponent } from './models/LootBox';

export interface ISetLootBoxesParams { items: Array<ILootBox>; projectName: string; }
export interface IChangeLootBoxVersionParams { version: ILootBoxVersion; newVersion: ILootBoxVersion; lootBoxId: any; projectName: string; }
export interface ISelectLootBoxParams { lootBox: ILootBox; projectName: string; }
export interface IDeleteLootBoxVersionParams { version: ILootBoxVersion, lootBoxId: any; projectName: string; }
export interface ICreateLootBoxVersionParams { version: ILootBoxVersion, lootBoxId: any; projectName: string; }
export interface IChangeLootBoxComponentParams { lootBoxId: any; component: ILootBoxComponent; newComponent: ILootBoxComponent; projectName: string; }
export interface IDeleteLootBoxComponentParams { lootBoxId: any; component: ILootBoxComponent; projectName: string; }
export interface ICreateLootBoxComponentParams { lootBoxId: any; component: ILootBoxComponent; projectName: string; }
export interface IMoveLootBoxComponentParams { lootBoxId: any; from: number; to: number; projectName: string; }
export interface IChangeLootBoxParams {
    lootBoxId: any;
    changes: {
        name?: {
            [key: string]: string;
        };
        components?: Array<ILootBoxComponent>;
        id?: any;
        withdrawn?: boolean;
    };
    projectName: string;
}
export interface ICheckLootBoxVisibilityParams { lootBoxId: any; projectName: string; }

export const {
    setLootBoxes,
    changeLootBoxVersion,
    setLootBox,
    deleteLootBoxVersion,
    createLootBoxVersion,
    changeLootBoxComponent,
    deleteLootBoxComponent,
    createLootBoxComponent,
    changeLootBoxParams,
    moveLootBoxComponent,
    checkLootBoxVisibility
} = {
    setLootBoxes: (params: ISetLootBoxesParams) => createAction('setLootBoxes', params),
    changeLootBoxVersion: (params: IChangeLootBoxVersionParams) => createAction('changeLootBoxVersion', params),
    setLootBox: (params: ISelectLootBoxParams) => createAction('setLootBox', params),
    deleteLootBoxVersion: (params: IDeleteLootBoxVersionParams) => createAction('deleteLootBoxVersion', params),
    createLootBoxVersion: (params: ICreateLootBoxVersionParams) => createAction('createLootBoxVersion', params),
    changeLootBoxComponent: (params: IChangeLootBoxComponentParams) => createAction('changeLootBoxComponent', params),
    deleteLootBoxComponent: (params: IDeleteLootBoxComponentParams) => createAction('deleteLootBoxComponent', params),
    createLootBoxComponent: (params: ICreateLootBoxComponentParams) => createAction('createLootBoxComponent', params),
    changeLootBoxParams: (params: IChangeLootBoxParams) => createAction('changeLootBoxParams', params),
    moveLootBoxComponent: (params: IMoveLootBoxComponentParams) => createAction('moveLootBoxComponent', params),
    checkLootBoxVisibility: (params: ICheckLootBoxVisibilityParams) => createAction('checkLootBoxVisibility', params)
};

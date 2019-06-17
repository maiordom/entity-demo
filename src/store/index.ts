import { IUser } from 'src/entities/User/store';
import { IApps, IAppsOptions, appsOptions } from 'src/entities/Apps/store';
import { IDocuments, documents } from 'src/entities/Documents/store';
import navigation, { IRoutes } from 'src/entities/Navigation/store';
import { IRequestJournal } from 'src/entities/RequestJournal/store';
import { IUsersGroupsModel } from 'src/entities/UsersGroups/store';
import { IRequestErrors } from 'src/entities/RequestError/store';
import { IContent, content } from 'src/entities/Content/store';
import { IImagesGroups, imagesGroups } from 'src/entities/ImagesGroups/store';
import { IArea, area } from 'src/entities/Area/store';
import { ICodes, codes } from 'src/entities/Codes/store';
import { IClaims, claims } from 'src/entities/Claim/store';
import { IRoles, roles } from 'src/entities/Roles/store';
import { IAccounts, accounts } from 'src/entities/Accounts/store';
import { IEvents, events } from 'src/entities/Events/store';
import { IEventFilters, eventFilters } from 'src/entities/EventFilters/store';
import { IGameAuth, gameAuth } from 'src/entities/GameAuth/store';
import { IContactHistory, contactHistory } from 'src/entities/ContactHistory/store';
import { IGameShop, gameShop } from 'src/entities/GameShop/store';
import { IBilling, billing } from 'src/entities/Billing/store';
import { IStatusMonitor, statusMonitor } from 'src/entities/StatusMonitor/store';
import { IShopItems, shopItems } from 'src/entities/ShopItems/store';
import { IPagination, pagination } from 'src/entities/Pagination/store';
import { IWebshopCategories, webshopCategories } from 'src/entities/WebshopCategories/store';
import { ISite, site } from 'src/entities/Site/store';
import { IProfiles, profiles } from 'src/entities/Profiles/store';
import { ILootBoxes, lootBoxes } from 'src/entities/LootBoxes/store';
import { IBrowserTabs, browserTabs } from 'src/entities/BrowserTabs/store';

export { IError } from 'src/entities/RequestError/store';

export interface IStore {
    accounts: IAccounts;
    about: {
        tag: string;
    };
    apps: IApps;
    appsOptions: IAppsOptions;
    area: IArea;
    billing: IBilling;
    codes: ICodes;
    content: IContent;
    claims: IClaims;
    documents: IDocuments;
    events: IEvents;
    eventFilters: IEventFilters;
    imagesGroups: IImagesGroups;
    user: IUser;
    navigation: IRoutes;
    requestJournal: IRequestJournal;
    usersGroups: IUsersGroupsModel;
    requestErrors: IRequestErrors;
    roles: IRoles;
    gameAuth: IGameAuth;
    contactHistory: IContactHistory;
    gameShop: IGameShop;
    statusMonitor: IStatusMonitor;
    shopItems: IShopItems;
    pagination: IPagination;
    webshopCategories: IWebshopCategories;
    site: ISite;
    profiles: IProfiles;
    lootBoxes: ILootBoxes;
    browserTabs: IBrowserTabs;
}

export const getInitialState = () => {
    const initialState: IStore = {
        accounts,
        apps: {},
        about: { tag: '{{TAG}}' },
        appsOptions,
        area,
        browserTabs,
        billing,
        codes,
        content,
        claims,
        documents,
        events,
        eventFilters,
        gameAuth,
        imagesGroups,
        navigation,
        user: { permissions: {}, claims: {} },
        requestJournal: {},
        shopItems,
        usersGroups: {},
        requestErrors: {},
        roles,
        contactHistory,
        gameShop,
        statusMonitor,
        pagination,
        webshopCategories,
        site,
        profiles,
        lootBoxes
    };

    return initialState;
};

export const getCurrentState = () => JSON.parse(localStorage.getItem('state'));

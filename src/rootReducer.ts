import UserReducer from './entities/User/reducer';
import NavigationReducer from './entities/Navigation/reducer';
import AppsReducer from './entities/Apps/reducer';
import RequestJournalReducer from './entities/RequestJournal/reducer';
import UsersGroupsReducer from './entities/UsersGroups/reducer';
import RequestErrorsReducer from './entities/RequestError/reducer';
import ContentReducer from './entities/Content/reducer';
import ImagesGroups from './entities/ImagesGroups/reducer';
import Area from './entities/Area/reducer';
import Documents from './entities/Documents/reducer';
import ShopItems from './entities/ShopItems/reducer';
import Codes from './entities/Codes/reducers';
import Roles from './entities/Roles/reducer';
import Claims from './entities/Claim/reducer';
import Accounts from './entities/Accounts/reducer';
import Events from './entities/Events/reducer';
import EventFilters from './entities/EventFilters/reducer';
import GameAuth from './entities/GameAuth/reducer';
import ContactHistory from './entities/ContactHistory/reducer';
import GameShop from './entities/GameShop/reducer';
import Billing from './entities/Billing/reducer';
import StatusMonitor from './entities/StatusMonitor/reducer';
import Pagination from './entities/Pagination/reducer';
import WebshopCategories from './entities/WebshopCategories/reducer';
import Site from './entities/Site/reducer';
import Profiles from './entities/Profiles/reducer';
import LootBoxes from './entities/LootBoxes/reducer';
import BrowserTabs from './entities/BrowserTabs/reducer';

export default function(state, action) {
    state = {...state};

    [
        AppsReducer,
        Billing,
        UserReducer,
        NavigationReducer,
        RequestJournalReducer,
        UsersGroupsReducer,
        RequestErrorsReducer,
        ContentReducer,
        ImagesGroups,
        Area,
        Documents,
        ShopItems,
        Codes,
        Roles,
        Claims,
        Accounts,
        Events,
        EventFilters,
        GameAuth,
        ContactHistory,
        GameShop,
        StatusMonitor,
        Pagination,
        WebshopCategories,
        Site,
        Profiles,
        LootBoxes,
        BrowserTabs
    ].forEach(reducer => {
        state = reducer(state, action);
    });

    localStorage.setItem('state', JSON.stringify(state));
    window['$state'] = state;

    return state;
}

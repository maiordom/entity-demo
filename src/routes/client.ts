export const clientRoutes = {
    general: '/',
    auth: '/auth',
    documents: '/documents',
    test: '/test',
    webshop: '/shop',
    userGroups: '/user/groups',
    webshopCategories: '/shop/categories',
    productDescriptions: '/shop/descriptions',
    content: '/content',
    pages: '/content/pages',
    newPage: '/content/pages/new',
    editPage: '/content/pages/edit',
    accounts: '/accounts',
    account: '/accounts/:id',
    contactHistory: '/contact-history',
    contactHistoryAccount: '/contact-history/:id',
    codes: '/codes',
    administration: '/administration',
    claims: '/administration/claims',
    roles: '/administration/roles',
    newRole: '/administration/roles/new',
    editRole: '/administration/roles/edit',
    createCodes: '/codes/create',
    codeActivations: '/codes/activations',
    massBan: '/batch-operations',
    massSubscription: '/batch-operations/subscription',
    gameShopItems: '/shop/dictionary',
    aionLootBoxes: '/shop/lootboxes/aion',
    aionLootBox: '/shop/lootboxes/aion/:id',
    pbLootBoxes: '/shop/lootboxes/pb',
    pbLootBox: '/shop/lootboxes/pb/:id',
    statusMonitor: '/status-monitor',
    transactions: '/billing/transactions'
};

export const getRoute = (routeName, params) => Object
    .keys(params)
    .reduce((clientRoute, key) => (
        clientRoute.replace(`:${key}`, params[key])
    ), clientRoutes[routeName]);

export default clientRoutes;

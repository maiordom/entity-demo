import { IUserClaims } from './models/UserClaims';
import { IClaim } from './models/Claim';
import { IAppsOptions } from 'src/entities/Apps/store';

export { IUserClaims } from './models/UserClaims';

export interface IClaimsGroup {
    name: string;
    claims: Array<{
        source: string;
        alias?: string;
    }>;
}

export interface IClaims {
    apps: IAppsOptions;
    userId: string;
    deletedClaims: Array<IClaim>;
    newClaims: Array<IClaim>;
    claimsList: Array<IClaim>;
    claimsByType: IUserClaims;
    claimsByService: IUserClaims;
    groups: {
        [key: string]: IClaimsGroup;
    };
}

export const claims: IClaims = {
    apps: {
        items: [],
        selected: null
    },
    deletedClaims: [],
    newClaims: [],
    claimsList: null,
    userId: null,
    claimsByType: {},
    claimsByService: {},
    groups: {
        achievements: {
            name: 'achievements',
            claims: [
                { source: 'am.s.w', alias: 'achievementmanager.sagas.write' },
                { source: 'am.s.r', alias: 'achievementmanager.sagas.read' }
            ]
        },
        actionManager: {
            name: 'actionManager',
            claims: [
                { source: 'actionmanager.write.sagas' },
                { source: 'actionmanager.read.sagas' },
                { source: 'actionmanager.write.sets' }
            ],
        },
        auth: {
            name: 'auth',
            claims: [
                { source: 'auth.read.userroles' },
                { source: 'auth.write.userroles' },
                { source: 'auth.delete.userroles' },
                { source: 'auth.read.roles' },
                { source: 'auth.write.roles' },
                { source: 'auth.delete.roles' },
                { source: 'auth.read.claims' },
                { source: 'auth.write.claims' },
                { source: 'auth.delete.claims' },
                { source: 'a.w.t', alias: 'auth.write.tokenexpiration' },
                { source: 'a.d.u', alias: 'auth.delete.users' },
                { source: 'a.w.u', alias: 'auth.write.users' },
                { source: 'a.r.u', alias: 'auth.read.users' },
                { source: 'a.r.c', alias: 'auth.clients.read' },
                { source: 'a.w.c', alias: 'auth.clients.write' },
                { source: 'a.r.restrictions', alias: 'auth.read.restrictions' },
                { source: 'a.w.restrictions', alias: 'auth.write.restrictions' }
            ]
        },
        billing: {
            name: 'billing',
            claims: [
                { source: 'b.ta.w', alias: 'billing.testaccount.write' },
                { source: 'b.ps.r', alias: 'billing.paymentsystems.read' },
                { source: 'b.ps.w', alias: 'billing.paymentsystems.write' },
                { source: 'b.t.r', alias: 'billing.transactions.read' },
                { source: 'b.t.w', alias: 'billing.transactions.write' },
                { source: 'b.s.r', alias: 'billing.shops.read' },
                { source: 'b.s.w', alias: 'billing.shops.write' },
                { source: 'b.b.r', alias: 'billing.bonuses.read' },
                { source: 'b.t.mp', alias: 'billing.manual.payments' },
                { source: 'b.b.mw', alias: 'billing.bonuses.manywrite' },
                { source: 'b.b.w', alias: 'billing.bonuses.write' }
            ]
        },
        content: {
            name: 'content',
            claims: [
                { source: 'content.read.widgets' },
                { source: 'content.write.widget' },
                { source: 'content.read.pages' },
                { source: 'content.write.pages' }
            ]
        },
        documents: {
            name: 'documents',
            claims: [
                { source: 'docs.juristics.read' },
                { source: 'docs.juristics.write' },
                { source: 'docs.juristics.publish' },
                { source: 'docs.juristics.delete' },
                { source: 'docs.webshop.read' },
                { source: 'docs.webshop.write' },
                { source: 'docs.webshop.publish' },
                { source: 'docs.webshop.delete' },
                { source: 'docs.patchnotes.read' },
                { source: 'docs.patchnotes.write' },
                { source: 'docs.patchnotes.publish' },
                { source: 'docs.patchnotes.delete' }
            ]
        },
        enaza: {
            name: 'enaza',
            claims: [
                { source: 'e.o.r', alias: 'enaza.orders.read' },
                { source: 'e.o.w', alias: 'enaza.orders.write' },
                { source: 'e.k', alias: 'enaza.keys' }
            ]
        },
        eventStore: {
            name: 'eventStore',
            claims: [
                { source: 'eventstore.read.userevents' }
            ]
        },
        gameAuth: {
            name: 'gameAuth',
            claims: [
                { source: 'ga.write.subscriptions' },
                { source: 'ga.writemany.subscriptions' },
                { source: 'ga.read.accounts' },
                { source: 'ga.write.accounts' },
                { source: 'ga.writemany.accounts' },
                { source: 'ga.write.licenses' },
                { source: 'ga.write.roles' }
            ]
        },
        gameShop: {
            name: 'gameShop',
            claims: [
                { source: 'gs.read.items' },
                { source: 'gs.write.items' },
                { source: 'gs.read.categories' },
                { source: 'gs.write.categories' },
                { source: 'gs.read.orders' },
                { source: 'gs.write.orders' },
                { source: 'gs.d.r', alias: 'gs.delivery.read' },
                { source: 'gs.d.w', alias: 'gs.delivery.write' },
                { source: 'gs.w.j', alias: 'gs.write.jobs' }
            ]
        },
        groupManager: {
            name: 'groupManager',
            claims: [
                { source: 'gm.read.groups' },
                { source: 'gm.write.groups' },
                { source: 'gm.read.sagas' },
                { source: 'gm.write.sagas' }
            ]
        },
        guard: {
            name: 'guard',
            claims: [
                { source: 'guard.confirmations.send' },
                { source: 'guard.read.securitypolicies' },
                { source: 'guard.write.securitypolicies' },
                { source: 'guard.read.computers' },
                { source: 'guard.write.computers' }
            ]
        },
        media: {
            name: 'media',
            claims: [
                { source: 'media.write.groups' },
                { source: 'media.read.groups' },
                { source: 'media.write.images' }
            ]
        },
        news: {
            name: 'news',
            claims: [
                { source: 'news.f.w', alias: 'news.feed.write' },
                { source: 'news.f.r', alias: 'news.feed.read' }
            ]
        },
        notificator: {
            name: 'notificator',
            claims: [
                { source: 'notificator.read.notifications' },
                { source: 'notificator.write.notifications' },
                { source: 'notificator.send.notifications' }
            ]
        },
        ratings: {
            name: 'ratings',
            claims: [
                { source: 'r.pb.t.r', alias: 'ratings.pb.top.read' },
                { source: 'r.pb.t.w', alias: 'ratings.pb.top.write' }
            ]
        },
        s2s: {
            name: 's2s',
            claims: [
                { source: 's2s.write.sagas' },
                { source: 's2s.read.sagas' },
                { source: 's2s.write.partners' },
                { source: 's2s.read.partners' },
                { source: 's2s.delete.partners' },
                { source: 's2s.read.c', alias: 's2s.read.campaigns' },
                { source: 's2s.write.c', alias: 's2s.write.campaigns' }
            ]
        },
        statusMonitor: {
            name: 'statusMonitor',
            claims: [
                { source: 'statusmonitor.read.checks' },
                { source: 'statusmonitor.write.checks' }
            ]
        },
        subscriptions: {
            name: 'subscriptions',
            claims: [
                { source: 'sbs.w', alias: 'subscriptions.write' },
                { source: 'sbs.r', alias: 'subscriptions.read' },
                { source: 'sbs.p', alias: 'subscriptions.prohibit' }
            ]
        },
        surveys: {
            name: 'surveys',
            claims: [
                { source: 'surveys.read.feedbacks' }
            ]
        },
        webshop: {
            name: 'webshop',
            claims: [
                { source: 'w.bt.r', alias: 'webshop.betatesting.read' },
                { source: 'w.bt.w', alias: 'webshop.betatesting.write' },
                { source: 'w.p.r', alias: 'webshop.products.read' },
                { source: 'w.p.w', alias: 'webshop.products.write' },
                { source: 'w.y.r', alias: 'webshop.yandex.read' },
                { source: 'w.y.w', alias: 'webshop.yandex.write' },
                { source: 'w.s.r', alias: 'webshop.services.read' },
                { source: 'w.s.w', alias: 'webshop.services.write' },
                { source: 'w.pc.r', alias: 'webshop.promocodes.read' },
                { source: 'w.pc.w', alias: 'webshop.promocodes.write' },
                { source: 'w.o.r', alias: 'webshop.orders.read' },
                { source: 'w.o.w', alias: 'webshop.orders.write' },
                { source: 'w.pc.b', alias: 'webshop.promocodes.bonuses' }
            ]
        }
    }
};

import compact from 'lodash/compact';

import routes from '../../routes/client';

export interface IRoute {
    alias: string;
    name: string;
    link: string;
    routes: Array<IRoute>;
    isActive?: boolean;
}

export type IRoutes = Array<IRoute>;

export default [
    {
        alias: 'navigation',
        name: 'Навигация',
        link: '/',
        routes: [
            {
                alias: 'accounts',
                name: 'Аккаунты',
                link: routes.accounts
            },
            {
                alias: 'contactHistory',
                name: 'История контакта',
                link: routes.contactHistory
            },
            {
                alias: 'userGroups',
                name: 'Группы пользователей',
                link: routes.userGroups
            },
            {
                alias: 'documents',
                name: 'Документы',
                link: routes.documents
            },
            {
                alias: 'codes',
                name: 'Коды',
                link: routes.codes,
                routes: [
                    {
                        alias: 'createCodes',
                        name: 'Генерация',
                        link: routes.createCodes
                    },
                    {
                        alias: 'codeActivations',
                        name: 'Активации',
                        link: routes.codeActivations
                    }
                ]
            },
            {
                alias: 'shop',
                name: 'Магазин',
                link: routes.webshop,
                routes: compact([
                    {
                        alias: 'shopItems',
                        name: 'Категории',
                        link: routes.webshopCategories
                    },
                    {
                        alias: 'productDescriptions',
                        name: 'Описание товаров',
                        link: routes.productDescriptions
                    },
                    {
                        alias: 'gameShopItems',
                        name: 'Словарь',
                        link: routes.gameShopItems
                    },
                    {
                        alias: 'aionWheelOfFortune',
                        name: 'Колесо фортуны',
                        link: routes.aionLootBoxes
                    },
                    {
                        alias: 'pbShootingRange',
                        name: 'Тир',
                        link: routes.pbLootBoxes
                    }
                ])
            },
            {
                alias: 'content',
                name: 'Контент',
                link: routes.content
            },
            {
                alias: 'administration',
                name: 'Роли и доступы',
                link: routes.administration,
                routes: [
                    {
                        alias: 'claims',
                        name: 'Доступы',
                        link: routes.claims
                    },
                    {
                        alias: 'roles',
                        name: 'Менеджер ролей',
                        link: routes.roles
                    }
                ]
            },
            {
                alias: 'mass',
                name: 'Массовые операции',
                link: routes.massBan,
                routes: [
                    {
                        alias: 'massSubscription',
                        name: 'Подписки',
                        link: routes.massSubscription
                    }
                ]
            },
            {
                alias: 'statusMonitor',
                name: 'Статус монитор',
                link: routes.statusMonitor
            },
            {
                alist: 'billing',
                name: 'Биллинг',
                link: routes.transactions
            }
        ]
    }
] as Array<IRoute>;

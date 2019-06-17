export const apiConfig = {
    production: {
        ru: {
            admin: 'https://adminbff.ru.entity-demo.com',
            webshop: 'https://webshop.ru.entity-demo.com'
        },
        eu: {
            admin: 'https://adminbff.eu.entity-demo.com',
            webshop: 'https://webshop.eu.entity-demo.com'
        },
        br: {
            admin: 'https://adminbff.br.entity-demo.com',
            webshop: 'https://webshop.br.entity-demo.com'
        }
    },
    qa: {
        ru: {
            admin: 'https://ru-adminbff.testentity-demo.com',
            webshop: 'https://ru-webshop.testentity-demo.com'
        },
        eu: {
            admin: 'https://eu-adminbff.testentity-demo.com',
            webshop: 'https://eu-webshop.testentity-demo.com'
        },
        br: {
            admin: 'https://br-adminbff.testentity-demo.com',
            webshop: 'https://br-webshop.testentity-demo.com'
        }
    },
    development: {
        ru: {
            admin: 'https://ru-adminbff.testentity-demo.com',
            webshop: 'https://ru-webshop.testentity-demo.com'
        },
        eu: {
            admin: 'https://eu-adminbff.testentity-demo.com',
            webshop: 'https://eu-webshop.testentity-demo.com'
        },
        br: {
            admin: 'https://br-adminbff.testentity-demo.com',
            webshop: 'https://br-webshop.testentity-demo.com'
        }
    }
};

export default () => apiConfig[__ENV__] || apiConfig.development;

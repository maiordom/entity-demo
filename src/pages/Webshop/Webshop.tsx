import React from 'react';
import { Tabs, TabPanel, Tab, TabList } from 'react-tabs';

import { Container, Title } from 'src/components/Layout/Layout';

import WebshopItems from 'src/pages/Webshop/WebshopItems';
import WebshopImport from 'src/pages/Webshop/WebshopImport';
import WebshopExport from 'src/pages/Webshop/WebshopExport';

import tabsCss from 'src/components/Tabs/Tabs.css';

export default class WebshopPage extends React.PureComponent<any, any> {
    render() {
        return (
            <Container>
                <Title>Товары</Title>
                <Tabs className="mt-s">
                    <TabList className={`${tabsCss.list} pl-xl`}>
                        <Tab className={tabsCss.tab} selectedClassName={tabsCss.tabSelected}>Поиск</Tab>
                        <Tab className={tabsCss.tab} selectedClassName={tabsCss.tabSelected}>Экспорт CSV</Tab>
                        <Tab className={tabsCss.tab} selectedClassName={tabsCss.tabSelected}>Импорт CSV</Tab>
                    </TabList>
                    <TabPanel>
                        <WebshopItems />
                    </TabPanel>
                    <TabPanel className="ml-xl">
                        <WebshopExport />
                    </TabPanel>
                    <TabPanel className="ml-xl">
                        <WebshopImport />
                    </TabPanel>
                </Tabs>
            </Container>
        );
    }
}

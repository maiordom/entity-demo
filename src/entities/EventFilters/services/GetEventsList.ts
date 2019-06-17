import { IEventFiltersCategories, IEventsList } from 'src/entities/EventFilters/store';
import { AxiosResponse } from 'axios';
import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

export interface IGetEventsListResponse {
    data: {
        groups: {
            [name: string]: Array<{
                type: string;
                name: string;
            }>;
        };
    };
}

export const getEventsList = (): Promise<{
    categories: IEventFiltersCategories,
    eventsList: IEventsList
}> => request.call(routes.events.getEventsList)
    .then(({ data: { data: { groups } } }: AxiosResponse<IGetEventsListResponse>) => {
        const categories: IEventFiltersCategories = {};
        const eventsList: IEventsList = {};

        Object.keys(groups).forEach((groupName) => {
            categories[groupName] = [];

            groups[groupName].forEach((event) => {
                if (!eventsList[event.type]) {
                    eventsList[event.type] = {
                        isActive: false,
                        ...event
                    };
                }

                categories[groupName].push(eventsList[event.type]);
            });
        });

        return { categories, eventsList };
    });

import { AxiosResponse } from 'axios';
import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';
import { IEventFiltersPreset } from '../models/IEventFiltersPreset';

export interface IGetPresetsParams { userId: number; }

interface IGetPresetsResult {
    presets: Array<IEventFiltersPreset>;
}

interface IGetPresetsResponse {
    data: Array<IEventFiltersPreset>;
}

export const getPresets = (params: IGetPresetsParams): Promise<IGetPresetsResult> =>
    request.call(
        (routes.events.getPresets as TRouteHandler)(params)
    ).then(({ data: { data } }: AxiosResponse<IGetPresetsResponse>) => {
        data.sort((a, b) => {
            if (a.name > b.name) {
                return 1;
            } else if (a.name < b.name) {
                return -1;
            }

            return 0;
        });

        return { presets: data };
    });

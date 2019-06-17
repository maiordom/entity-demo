import { request } from 'src/utils/Request';
import routes from 'src/routes/api';
import { IEventFiltersPreset } from '../models/IEventFiltersPreset';

export const savePreset = (params: IEventFiltersPreset): Promise<any> =>
    request.call(routes.events.savePreset, { value: params });

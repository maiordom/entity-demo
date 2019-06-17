import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IRemovePreset { id: number; }

export const removePreset = (params: IRemovePreset): Promise<any> =>
    request.call(
        (routes.events.removePreset as TRouteHandler)(params)
    );

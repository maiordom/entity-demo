import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

interface IAddPresetParams {
    ownerUserId: number;
    name: string;
    eventTypes: Array<string>;
}

interface IAddPresetResponse {
    id: number;
    name: string;
    eventTypes: Array<string>;
}

export const addPreset = (params: IAddPresetParams): Promise<IAddPresetResponse> =>
    request.call(routes.events.addPreset, { value: params })
        .then(({ data: { data } }) => data);

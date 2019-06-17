import Defer, { IDefer } from 'src/utils/Defer';

import getJobService, { IGetJobRequestParams } from './services/GetJob';
export { IGetJobRequestParams, IGetJobResult } from './services/GetJob';

export const getJob = (params: IGetJobRequestParams) =>
    getJobService(params);

export const checkJobLoop = (params: IGetJobRequestParams, defer: IDefer) => {
    getJob(params).then(({ status, failed }) => {
        if (['Scheduled', 'Processing'].includes(status)) {
            setTimeout(() => {
                checkJobLoop(params, defer);
            }, 1000);
        } else {
            defer.resolve({ status, failed });
        }
    }).catch(() => {
        defer.reject();
    });
};

export const checkJob = (params: IGetJobRequestParams) => {
    const defer = Defer();

    checkJobLoop(params, defer);

    return defer.promise;
};

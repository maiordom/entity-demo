export interface IDefer {
    resolve: (res?: any) => void;
    reject: (err?: any) => void;
    promise: Promise<any>;
}

export const defer = (): IDefer => {
    const deferred = {} as IDefer;

    const promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    deferred.promise = promise;

    return deferred;
};

export default defer;

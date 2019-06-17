export const createAction = <T extends string, P extends {}>(type: T, payload?: P) => {
    return {
        type,
        payload
    } as {
        readonly type: T,
        readonly payload: P
    };
};
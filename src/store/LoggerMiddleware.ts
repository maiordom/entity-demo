export default () => (next: any) => (action: any) => {
    const now = performance.now();

    next(action);
    const time = (performance.now() - now).toFixed(2);
    console.groupCollapsed(
        `%caction::${action.type} (${time}ms)`,
        'color: #ccc;'
    );
    console.log('Action payload:', action);
    console.groupEnd();
};

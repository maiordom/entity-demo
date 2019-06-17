export interface IPagination<T> {
    from: number,
    total: number,
    items: T[]
}

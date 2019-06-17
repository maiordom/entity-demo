export interface IChangedValue {
    old: string;
    new: string;
}

export interface IUserEvent {
    value: string | IChangedValue;
    serviceId: string;
    userId: string;
    type: string;
    when: string;
}

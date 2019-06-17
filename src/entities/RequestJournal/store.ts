import { IError } from 'src/store';

export interface IRequest {
    name: string;
    data: {
        [key: string]: string | number;
    };
    params?: {
        [key: string]: string | number;
    };
    error?: IError;
}

export interface IRequestJournal {
    [key: string]: IRequest;
}

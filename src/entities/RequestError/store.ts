export interface IError { 
    code: string;
    description: string;
    details?: {
        url: string;
        data: string;
    };
}

export interface IRequestErrors {
    [key: string]: IError;
}
export interface IServerTCPCheck {
    name: string;
    type: 'tcp';
    host: string;
    port: string;
}

export interface IServerHTTPCheck {
    name: string;
    type: 'http';
    url: string;
    host?: string;
    method: string;
}

export type IServerCheck = IServerTCPCheck | IServerHTTPCheck;
export type ICheckMode = 'auto' | 'on' | 'off';

export interface IServerChecks {
    name: string;
    checkMode: ICheckMode;
    checks: Array<IServerCheck>;
}
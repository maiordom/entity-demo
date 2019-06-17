export interface IEventContext {
    application: string;
    trackingId: string;
    geo: string;
    area: string;
    ip: string;
    requestId: string;
    correlationId: string;
    operatorId: string;
    messageWhen: string;
    idempotencyKey: string;
    asn: string;
    launcherId: string;
    hardwareId: string;
    messageId: string;
}

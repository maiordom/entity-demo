export interface INews {
    feedId?: string;
    id?: string;
    imageId?: string;
    title?: string;
    lead?: string;
    whenPublished?: string;
    sourceData?: {
        source?: string;
        url?: string;
    };
}

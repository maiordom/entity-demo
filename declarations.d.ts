declare var __ENV__: 'production' | 'qa' | 'development';
declare var __TAG__: string;
declare var YT: any;

declare module '*.css' {
    const content: any;
    export default content;
}

declare module '*.json' {
    const content: any;
    export default content;
}

declare module '*.mp3' {
    const content: any;
    export default content;
}
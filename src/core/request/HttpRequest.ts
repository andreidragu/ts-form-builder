module core.request {
    export interface Response200 {
        status_code?: number;
        token?: string;
        data?: object[];
        [key: string]: any;
    }

    export interface Response403 {
        error?: {
            message: string,
            status_code?: number
        };
        [key: string]: any;
    }

    export interface HttpRequest {
        requestInternal(url: string): Promise<string>;
        requestExternal(url: string, method?: string): Promise<Response200 | Response403>;
    }
}
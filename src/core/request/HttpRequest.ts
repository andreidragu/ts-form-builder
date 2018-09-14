module core.request {
    export interface Response200 {
        status_code: number;
        token: string;
    }

    export interface Response403 {
        error: {
            message: string,
            status_code?: number
        }
    }

    export interface HttpRequest {
        requestInternal(url: string): Promise<string>;
        requestExternal(url: string): Promise<Response200 | Response403>;
    }
}
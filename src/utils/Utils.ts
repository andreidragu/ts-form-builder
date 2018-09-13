module Utils {

    export enum FETH_METHOD {
        GET = 'GET',
        POST = 'POST'
    }

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

    export class HttpUtils {

        public static fetchInternal(url: string): Promise<string> {
            return fetch(url)
                .then((response: Response) => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        return 'Something bad happened. Better start debugging!';
                    }
                });
        }

        public static fetchExternal(url: string, method: FETH_METHOD): Promise<Response200 | Response403> {
            return fetch(url, {
                method: method,
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    'Access-Control-Request-Headers': 'content-type'
                }
            })
                .then((response: Response) => {
                    return response.json();
                });
        }
    }
}
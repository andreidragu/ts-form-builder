///<reference path="../core/request/HttpRequestFactory.ts"/>

module utils {
    import HttpRequestFactory = core.request.HttpRequestFactory;
    import HTTP_REQUEST_TYPE = core.request.HTTP_REQUEST_TYPE;
    import HttpRequest = core.request.HttpRequest;
    import Response200 = core.request.Response200;
    import Response403 = core.request.Response403;

    /**
     * Singleton class used to make http requests
     */
    export class HttpUtils {
        private static _instance: HttpUtils;
        private httpRequest: HttpRequest;

        private constructor() {
            const httpRequestFactory: HttpRequestFactory = new HttpRequestFactory();
            this.httpRequest = httpRequestFactory.getHttpRequestType(HTTP_REQUEST_TYPE.XHR);
        }

        /**
         * HttpUtils single instance object
         */
        public static getInstance(): HttpUtils {
            if (this._instance === undefined) {
                this._instance = new HttpUtils();
            }
            return this._instance;
        }

        public requestInternal(url: string): Promise<string> {
            return this.httpRequest.requestInternal(url);
        }

        public requestExternal(url: string, method?: string): Promise<Response200 | Response403> {
            return this.httpRequest.requestExternal(url, method);
        }
    }
}
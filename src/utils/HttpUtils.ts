/// <reference path='../core/request/HttpRequestFactory.ts' />

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
        private httpRequest: HttpRequest;

        private constructor() {
            const httpRequestFactory: HttpRequestFactory = new HttpRequestFactory(HTTP_REQUEST_TYPE.XHR);
            this.httpRequest = httpRequestFactory.getHttpRequestType();
        }

        private static _instance: HttpUtils;

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

        public requestExternal(url: string): Promise<Response200 | Response403> {
            return this.httpRequest.requestExternal(url);
        }
    }
}
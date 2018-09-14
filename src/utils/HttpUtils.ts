/// <reference path='../core/http/HttpRequestFactory.ts' />

module utils {
    import HttpRequest = core.http.HttpRequest;
    import HTTP_REQUEST_TYPE = core.http.HTTP_REQUEST_TYPE;
    import HttpRequestFactory = core.http.HttpRequestFactory;
    import Response200 = core.http.Response200;
    import Response403 = core.http.Response403;

    /**
     * Singleton class used to make http requests
     */
    export class HttpUtils {
        private httpRequest: HttpRequest;

        private constructor() {
            this.httpRequest = HttpRequestFactory.getInstance().getHttpRequestType(HTTP_REQUEST_TYPE.XHR);
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
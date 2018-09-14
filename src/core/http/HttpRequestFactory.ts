module core.http {
    export enum HTTP_REQUEST_TYPE {
        XHR,
        FETCH
    }

    export class HttpRequestFactory {
        private static _instance: HttpRequestFactory;

        private constructor() { }

        public static getInstance(): HttpRequestFactory {
            if (this._instance === undefined) {
                this._instance = new HttpRequestFactory();
            }
            return this._instance;
        }

        public getHttpRequestType(httpRequestType: HTTP_REQUEST_TYPE = HTTP_REQUEST_TYPE.FETCH): HttpRequest {
            switch (httpRequestType) {
                case HTTP_REQUEST_TYPE.XHR:
                    return new XhrRequest();
                case HTTP_REQUEST_TYPE.FETCH:
                    return new FetchRequest();
            }
        }
    }
}
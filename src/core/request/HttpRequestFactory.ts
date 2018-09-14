module core.request {
    export enum HTTP_REQUEST_TYPE {
        XHR,
        FETCH
    }

    export class HttpRequestFactory {
        private httpRequestType: HTTP_REQUEST_TYPE;

        constructor(httpRequestType: HTTP_REQUEST_TYPE = HTTP_REQUEST_TYPE.FETCH) {
            this.httpRequestType = httpRequestType;
        }

        public getHttpRequestType(): HttpRequest {
            switch (this.httpRequestType) {
                case HTTP_REQUEST_TYPE.XHR:
                    return new XhrRequest();
                case HTTP_REQUEST_TYPE.FETCH:
                    return new FetchRequest();
            }
        }
    }
}
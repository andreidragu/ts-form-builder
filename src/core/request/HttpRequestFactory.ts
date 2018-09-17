module core.request {
    export enum HTTP_REQUEST_TYPE {
        XHR,
        FETCH
    }

    export class HttpRequestFactory {
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
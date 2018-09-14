module core.http {
    export class XhrRequest implements HttpRequest {
        public requestInternal(url: string): Promise<string> {
            return new Promise<string>((resolve: Function, reject: Function) => {
                const xhr: XMLHttpRequest = new XMLHttpRequest();

                xhr.open('GET', url);

                xhr.onload = (evt: Event) => {
                    resolve(xhr.responseText);
                };

                xhr.send();
            });
        }

        public requestExternal(url: string): Promise<Response200 | Response403> {
            return new Promise<Response200 | Response403>((resolve: Function, reject: Function) => {
                const xhr: XMLHttpRequest = new XMLHttpRequest();

                xhr.open('POST', url);
                xhr.setRequestHeader('Content-Type', 'application/json');

                xhr.onload = (evt: Event) => {
                    resolve(this.parseXHRResult(xhr));
                };

                xhr.send();
            });
        }

        private parseXHRResult(xhr: XMLHttpRequest): Response200 | Response403 {
            return JSON.parse(xhr.responseText);
        }
    }
}
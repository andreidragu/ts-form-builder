module core.request {
    export class FetchRequest implements HttpRequest {

        public requestInternal(url: string): Promise<string> {
            return fetch(url)
                .then((response: Response) => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        return 'Something bad happened. Better start debugging!';
                    }
                });
        }

        public requestExternal(url: string, method: string = 'POST'): Promise<Response200 | Response403> {
            return fetch(url, {
                method: method,
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',

                }
            })
                .then((response: Response) => {
                    return response.json();
                });
        }
    }
}
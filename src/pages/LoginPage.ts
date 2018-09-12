/// <reference path='../utils/Utils.ts' />

module Pages {
    import HttpUtils = Utils.HttpUtils;
    import Response200 = Utils.Response200;
    import Response403 = Utils.Response403;

    export class LoginPage {
        private loginForm: HTMLFormElement;
        private errorElem: HTMLElement;

        constructor() {
            HttpUtils.fetchInternal('./login.html')
                .then((text: string) => {
                    document.getElementById('mainContainer').innerHTML = text;
                    this.initVars();
                });
        }

        private initVars(): void {
            this.loginForm = document.querySelector('form');
            this.errorElem = document.getElementById('errorElem');

            this.loginForm.onsubmit = (ev: Event) => {
                const data: FormData = new FormData(this.loginForm);
                const email: FormDataEntryValue = data.get('email');
                const password: FormDataEntryValue = data.get('password');
                HttpUtils.fetchExternal(`https://api.123contactform.com/v2/token?email=${email}&password=${password}`, Utils.FETH_METHOD.POST)
                .then((data: Response200 | Response403) => {
                    if ('error' in data) {
                        this.handleError(data);
                    } else {
                        this.handleSuccess(data);
                    }
                });
                ev.preventDefault();
            };
        }

        private handleError(data: Response403): void {
            this.errorElem.textContent = data.error.message;
            this.loginForm.reset();
        }

        private handleSuccess(data: Response200): void {
            window.sessionStorage.setItem('token', data.token);
            document.getElementById('mainContainer').innerHTML = '';
            new WelcomePage();
        }
    }
}
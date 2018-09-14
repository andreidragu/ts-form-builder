/// <reference path='BasePage.ts' />
/// <reference path='../utils/Utils.ts' />
/// <reference path='../utils/HttpUtils.ts' />

module Pages {
    import BasePage = Pages.BasePage;
    // import HttpUtils = Utils.HttpUtils;
    import HttpUtils = utils.HttpUtils;
    import Response200 = Utils.Response200;
    import Response403 = Utils.Response403;

    export class LoginPage extends BasePage {
        private loginForm: HTMLFormElement;
        private errorElem: HTMLElement;

        constructor() {
            super();
            // HttpUtils.fetchInternal('./login.html')
            //     .then((text: string) => {
            //         this.mainContainer.innerHTML = text;
            //         this.initLoginVars();
            //     });
            HttpUtils.getInstance().requestInternal('./login.html')
                .then((text: string) => {
                    this.mainContainer.innerHTML = text;
                    this.initLoginVars();
                });
        }

        /**
         * Initialize Login page variables.
         */
        protected initLoginVars(): void {
            this.loginForm = document.querySelector('form');
            this.errorElem = document.getElementById('errorElem');

            this.loginForm.onsubmit = this.onSubmitLoginForm.bind(this);
        }

        /**
         * Bind method to the on submit action for login form.
         * 
         * @param ev {Event} login form's event related object
         */
        private onSubmitLoginForm(ev: Event): void {
            this.errorElem.textContent = '';
            const formData: FormData = new FormData(this.loginForm);
            const emailForm: FormDataEntryValue = formData.get('email');
            const passForm: FormDataEntryValue = formData.get('password');

            (<HTMLFieldSetElement>document.getElementById('loginFormFieldset')).disabled = true;
            this.mainContainer.appendChild(this.loaderElem);

            if (emailForm === 'andrei.catalin7@gmail.com') {
                this.handleError({ error: { message: 'This user is locked. Too many tries!' } });
                ev.preventDefault();
                return;
            }

            // HttpUtils.fetchExternal(`https://api.123contactform.com/v2/token?email=${emailForm}&password=${passForm}`, Utils.FETH_METHOD.POST)
            //     .then((data: Response200 | Response403) => {
            //         if ('error' in data) {
            //             this.handleError(data);
            //         } else {
            //             this.handleSuccess(data);
            //         }
            //     });
            HttpUtils.getInstance().requestExternal(`https://api.123contactform.com/v2/token?email=${emailForm}&password=${passForm}`)
                .then((data: Response200 | Response403) => {
                    if ('error' in data) {
                        this.handleError(data);
                    } else {
                        this.handleSuccess(data);
                    }
                });
            ev.preventDefault();
        }

        /**
         * Handle response in case of an error.
         * 
         * @param data {Response403} error response data containing a status code and a message
         */
        private handleError(data: Response403): void {
            (<HTMLFieldSetElement>document.getElementById('loginFormFieldset')).disabled = false;
            this.mainContainer.removeChild(this.loaderElem);

            this.errorElem.textContent = data.error.message;
            const passElem: HTMLInputElement = (<HTMLInputElement>document.getElementById('password'));
            passElem.value = '';
        }

        /**
         * Handle success response.
         * 
         * @param data {Response200} response data containing token in case of succesfull request
         */
        private handleSuccess(data: Response200): void {
            window.sessionStorage.setItem('token', data.token);
            document.getElementById('mainContainer').innerHTML = '';
            this.mainContainer.innerHTML = this.loaderElem.innerHTML;
            new WelcomePage();
        }
    }
}
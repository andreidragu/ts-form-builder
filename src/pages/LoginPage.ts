/// <reference path='BasePage.ts' />
/// <reference path='../utils/DBUtils.ts' />
/// <reference path='../core/database/LoginEntity.ts' />
/// <reference path='../utils/HttpUtils.ts' />

module pages {
    import BasePage = pages.BasePage;
    import DBUtils = utils.DBUtils;
    import LoginEntity = core.database.LoginEntity;
    import HttpUtils = utils.HttpUtils;
    import Response200 = core.request.Response200;
    import Response403 = core.request.Response403;

    export class LoginPage extends BasePage {
        private loginEntities: LoginEntity[];
        private loginForm: HTMLFormElement;
        private errorElem: HTMLElement;

        constructor() {
            super();
            DBUtils.getInstance().manageLoginTable.getAllEntities()
                .then((loginEntities: LoginEntity[]) => {
                    this.loginEntities = loginEntities;
                    HttpUtils.getInstance().requestInternal('./login.html')
                        .then((text: string) => {
                            this.mainContainer.innerHTML = text;
                            this.initLoginVars();
                        });
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

            let loginEntity: LoginEntity = this.loginEntities.find((obj: LoginEntity) => {
                return obj.email === emailForm.toString();
            });
            if (loginEntity && loginEntity.isLockedOut) {
                loginEntity.loginDates.push(`Locked on: ${new Date().toDateString()}`);
                DBUtils.getInstance().manageLoginTable.updateEntity(loginEntity)
                    .then(() => {
                        this.handleError({ error: { message: 'This user is locked. Too many tries!' } });
                        ev.preventDefault();
                        return;
                    });
            } else if (!loginEntity) {
                loginEntity = new LoginEntity();
                loginEntity.id = loginEntity.email = emailForm.toString();
                this.loginEntities.push(loginEntity)
            }

            HttpUtils.getInstance().requestExternal(`https://api.123contactform.com/v2/token?email=${emailForm}&password=${passForm}`)
                .then((data: Response200 | Response403) => {
                    if ('error' in data) {
                        loginEntity.nrOfFailedTries++;
                        if (loginEntity.nrOfFailedTries === 5) {
                            loginEntity.isLockedOut = true;
                        }
                        DBUtils.getInstance().manageLoginTable.updateEntity(loginEntity)
                            .then(() => {
                                if (loginEntity.isLockedOut) {
                                    this.handleError({ error: { message: 'This user is locked. Too many tries!' } });
                                } else {
                                    this.handleError(data);
                                }
                            });
                    } else {
                        DBUtils.getInstance().manageLoginTable.updateEntity(loginEntity)
                            .then(() => {
                                this.handleSuccess(data);
                            });
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
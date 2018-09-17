/// <reference path='../utils/HttpUtils.ts' />
/// <reference path='../utils/DBUtils.ts' />

module pages {
    import FormEntity = core.database.FormEntity;
    import SubmissionEntity = core.database.SubmissionEntity;
    import Response200 = core.request.Response200;
    import Response403 = core.request.Response403;
    import DBUtils = utils.DBUtils;
    import HttpUtils = utils.HttpUtils;

    export class WelcomePage extends BasePage {
        private formEntities: FormEntity[];
        private welcomeTable: HTMLTableElement;

        constructor() {
            super();
            DBUtils.getInstance().manageFormTable.getAllEntities()
                .then((formEntities: FormEntity[]) => {
                    this.formEntities = formEntities;

                    HttpUtils.getInstance().requestInternal('./welcome.html')
                        .then((text: string) => {
                            document.getElementById('mainContainer').innerHTML = text;
                            this.initWelcomeVars();
                        });
                });
        }

        private initWelcomeVars(): void {
            this.getAllFormsAndSubmissions().then((formEntities: FormEntity[]) => {
                this.formEntities = formEntities;
                this.populateWelcomeTable();

                for (const formEntity of formEntities) {
                    DBUtils.getInstance().manageFormTable.updateEntity(formEntity);
                }
            });

            this.welcomeTable = <HTMLTableElement>document.getElementById('welcomeTable');

            this.populateWelcomeTable();
        }

        private populateWelcomeTable(): void {
            let earliest: number = Date.parse(this.formEntities[0].submissions[0].date);
            let latest: number = earliest;
            let firstFormName: string = '';
            let lastFormName: string = '';
            for (const formEntity of this.formEntities) {
                for (const submission of formEntity.submissions) {
                    const submissionDate: number = Date.parse(submission.date);
                    if (submissionDate < earliest) {
                        earliest = submissionDate;
                        firstFormName = formEntity.name;
                    }
                    if (submissionDate > latest) {
                        latest = submissionDate;
                        lastFormName = formEntity.name;
                    }
                }
            }

            const row: HTMLTableRowElement = this.welcomeTable.tBodies[0].insertRow(0);
            const first: HTMLTableCellElement = row.insertCell(0);
            const last: HTMLTableCellElement = row.insertCell(1);
            first.innerText = `The first submission was done on ${this.formatDate(new Date(earliest))} on ${firstFormName}`;
            last.innerText = `The last submission was done on ${this.formatDate(new Date(latest))} on ${lastFormName}`;
        }

        private getAllFormsAndSubmissions(): Promise<FormEntity[]> {
            return new Promise<FormEntity[]>((resolve: Function, reject: Function) => {
                HttpUtils.getInstance().requestExternal(`https://api.123contactform.com/v2/forms?JWT=${window.sessionStorage.getItem('token')}`, 'GET')
                    .then((formData: Response200 | Response403) => {
                        if ('error' in formData) {
                            console.log(formData.error.message);
                            reject(formData);
                        } else {
                            const formEntities: FormEntity[] = (<FormEntity[]>formData.data);
                            const totalNrOfForms: number = formData.meta.pagination.total;
                            for (let i: number = 0; i < totalNrOfForms; i++) {
                                HttpUtils.getInstance().requestExternal(`https://api.123contactform.com/v2/forms/${formEntities[i].id}/submissions?JWT=${window.sessionStorage.getItem('token')}`, 'GET')
                                    .then((submissionsData: Response200 | Response403) => {
                                        if ('error' in submissionsData) {
                                            console.log(submissionsData.error.message);
                                            reject(submissionsData);
                                        } else {
                                            formEntities[i].submissions = (<SubmissionEntity[]>submissionsData.data);
                                            if (i === totalNrOfForms - 1) {
                                                resolve(formEntities);
                                            }
                                        }
                                    });
                            }
                        }
                    });
            });
        }

        private formatDate(date: Date): string {
            const year: number = date.getFullYear();
            const month: string = date.getUTCMonth() > 9 ? date.getUTCMonth().toString() : `0${date.getUTCMonth()}`;
            const day: string = date.getUTCDay() > 9 ? date.getUTCDay().toString() : `0${date.getUTCDay()}`;
            const hour: string = date.getUTCHours() > 9 ? date.getUTCHours().toString() : `0${date.getUTCHours()}`;
            const minutes: string = date.getUTCMinutes() > 9 ? date.getUTCMinutes().toString() : `0${date.getUTCMinutes()}`;
            const seconds: string = date.getUTCSeconds() > 9 ? date.getUTCSeconds().toString() : `0${date.getUTCSeconds()}`;

            return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
        }
    }
}
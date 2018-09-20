///<reference path="../utils/HttpUtils.ts"/>
///<reference path="BasePage.ts"/>
///<reference path="../utils/DBUtils.ts"/>

module pages {
    import FormEntity = core.database.dao.FormEntity;
    import SubmissionEntity = core.database.dao.SubmissionEntity;
    import FieldsEntity = core.database.dao.FieldsEntity;
    import Response200 = core.request.Response200;
    import Response403 = core.request.Response403;
    import DBUtils = utils.DBUtils;
    import HttpUtils = utils.HttpUtils;
    import ControlEntity = core.database.dao.ControlEntity;

    interface TableData {
        name: string;
        email: string;
        phone: string;
    }

    export class WelcomePage extends BasePage {
        private formEntities: FormEntity[];
        private welcomeTable: HTMLTableElement;
        private tableDataAll: TableData[];

        private searchForm: HTMLFormElement;
        private inputSearchWhere: HTMLSelectElement;
        private inputSearchTYpe: HTMLSelectElement;

        constructor() {
            super();
            DBUtils.getInstance().manageFormTable.getAllEntities()
                .then((formEntities: FormEntity[]) => {
                    this.formEntities = formEntities;

                    HttpUtils.getInstance().requestInternal('./pages/welcome.html')
                        .then((text: string) => {
                            document.getElementById('mainContainer').innerHTML = text;

                            this.getAllFormsAndSubmissions().then((formEntities: FormEntity[]) => {
                                this.formEntities = formEntities;
                                this.initWelcomeVars();

                                for (const formEntity of formEntities) {
                                    DBUtils.getInstance().manageFormTable.updateEntity(formEntity);
                                }
                            });
                            // debug
                            // this.initWelcomeVars();
                        });
                });
        }

        private initWelcomeVars(): void {
            this.tableDataAll = [];
            this.welcomeTable = (<HTMLTableElement>document.getElementById('welcomeTable'));
            this.searchForm = <HTMLFormElement>document.getElementById('searchForm');
            this.inputSearchWhere = <HTMLSelectElement>document.getElementById('inputSearchWhere');
            this.inputSearchTYpe = <HTMLSelectElement>document.getElementById('inputSearchTYpe');

            this.initTableData();
            this.populateTableData(this.tableDataAll);

            this.searchForm.onsubmit = this.onSubmitSearchForm.bind(this);
        }

        private onSubmitSearchForm(ev: Event): void {
            const formData: FormData = new FormData(this.searchForm);
            const searchValue: string = (<string>formData.get('searchValue')).toLowerCase();
            const searchWhere: HTMLOptionElement = this.inputSearchWhere.options[this.inputSearchWhere.selectedIndex];
            const searchType: HTMLOptionElement = this.inputSearchTYpe.options[this.inputSearchTYpe.selectedIndex];

            if (searchValue === '') {
                this.populateTableData(this.tableDataAll);
            } else {
                const fullMatch: boolean = searchType.value === '2';
                const filteredTableData: TableData[] = this.tableDataAll.filter((tableData: TableData) => {
                    if (searchWhere.value === "1") {
                        return this.foundAll(searchValue, tableData, fullMatch);
                    } else if (searchWhere.value === "2") {
                        return this.foundName(searchValue, tableData, fullMatch);
                    } else {
                        return this.foundEmail(searchValue, tableData, fullMatch);
                    }
                });
                this.populateTableData(filteredTableData);
            }

            ev.preventDefault();
        }

        private foundAll(searchValue: string, tableData: TableData, fullMatch: boolean): boolean {
            if (fullMatch) {
                return tableData.name.toLowerCase() === searchValue ||
                    tableData.email.toLowerCase() === searchValue ||
                    tableData.phone.toLowerCase() === searchValue;
            } else {
                return tableData.name.toLowerCase().includes(searchValue) ||
                    tableData.email.toLowerCase().includes(searchValue) ||
                    tableData.phone.toLowerCase().includes(searchValue);
            }
        }

        private foundName(searchValue: string, tableData: TableData, fullMatch: boolean): boolean {
            if (fullMatch) {
                return tableData.name.toLowerCase() === searchValue;
            } else {
                return tableData.name.toLowerCase().includes(searchValue);
            }
        }

        private foundEmail(searchValue: string, tableData: TableData, fullMatch: boolean): boolean {
            if (fullMatch) {
                return tableData.email.toLowerCase() === searchValue;
            } else {
                return tableData.email.toLowerCase().includes(searchValue);
            }
        }

        private initTableData(): void {
            for (const formEntity of this.formEntities) {
                const controls: ControlEntity[] = formEntity.fields.controls.data;
                for (const submissionEntity of formEntity.submissions) {
                    let canPush: boolean = false;
                    const tableData: TableData = {
                        name: '-',
                        email: '-',
                        phone: '-'
                    };
                    const fields: any[] = submissionEntity.content.fields.field;
                    for (const field of fields) {
                        const control: ControlEntity = controls.find((obj: ControlEntity) => {
                            return obj.id === parseInt(field.fieldid.split('-')[0]);
                        });
                        switch (control.name) {
                            case 'Name':
                                tableData.name.length > 1 ? tableData.name += " " + field.fieldvalue : tableData.name = field.fieldvalue;
                                canPush = tableData.name !== '-';
                                break;
                            case 'Email':
                                tableData.email = field.fieldvalue;
                                canPush = tableData.email !== '-';
                                break;
                            case 'Phone':
                                tableData.phone = field.fieldvalue;
                                canPush = tableData.phone !== '-';
                                break;
                        }
                    }
                    if (canPush) {
                        this.tableDataAll.push(tableData);
                    }
                }
            }
        }

        private populateTableData(tableData: TableData[]): void {
            const rowsLength: number = this.welcomeTable.rows.length;
            for (let i: number = 1; i < rowsLength - 1; i++) {
                this.welcomeTable.deleteRow(1);
            }

            const feLength: number = tableData.length;
            for (let i: number = 0; i < feLength; i++) {
                const row: HTMLTableRowElement = this.welcomeTable.insertRow(i + 1);
                const name: HTMLTableDataCellElement = row.insertCell(0);
                const email: HTMLTableDataCellElement = row.insertCell(1);
                const phone: HTMLTableDataCellElement = row.insertCell(2);

                name.textContent = tableData[i].name;
                email.textContent = tableData[i].email;
                phone.textContent = tableData[i].phone;
            }
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
                                const oldFormEntity: FormEntity = this.formEntities.find((obj: FormEntity) => {
                                    return obj.id === formEntities[i].id;
                                });
                                if (oldFormEntity === undefined || (oldFormEntity !== undefined &&
                                    Date.parse(oldFormEntity.latest_submission.date) < Date.parse(formEntities[i].latest_submission.date))) {
                                    HttpUtils.getInstance().requestExternal(`https://api.123contactform.com/v2/forms/${formEntities[i].id}/submissions?JWT=${window.sessionStorage.getItem('token')}`, 'GET')
                                        .then((submissionsData: Response200 | Response403) => {
                                            if ('error' in submissionsData) {
                                                console.log(submissionsData.error.message);
                                                reject(submissionsData);
                                            } else {
                                                formEntities[i].submissions = (<SubmissionEntity[]>submissionsData.data);

                                                HttpUtils.getInstance().requestExternal(`https://api.123contactform.com/v2/forms/${formEntities[i].id}/fields?JWT=${window.sessionStorage.getItem('token')}`, 'GET')
                                                    .then((fieldsData: Response200 | Response403) => {
                                                        if ('error' in fieldsData) {
                                                            console.log(fieldsData.error.message);
                                                            reject(fieldsData);
                                                        } else {
                                                            formEntities[i].fields = <FieldsEntity>fieldsData.data;

                                                            if (i === totalNrOfForms - 1) {
                                                                resolve(formEntities);
                                                            }
                                                        }
                                                    });
                                            }
                                        });
                                } else {
                                    formEntities[i].submissions = this.formEntities[i].submissions;
                                    formEntities[i].fields = this.formEntities[i].fields;
                                    if (i === totalNrOfForms - 1) {
                                        resolve(formEntities);
                                    }
                                }
                            }
                        }
                    });
            });
        }
    }
}
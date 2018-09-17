/// <reference path='./core/database/ManageDatabase.ts' />
/// <reference path='./core/database/ManageTable.ts' />
/// <reference path='./core/database/ObjectStoreInfo.ts' />
/// <reference path='./core/database/LoginEntity.ts' />
/// <reference path='./core/database/FormEntity.ts' />

/// <reference path='./core/request/HttpRequestFactory.ts' />

/// <reference path='./pages/BasePage.ts' />
/// <reference path='./pages/WelcomePage.ts' />
/// <reference path='./pages/LoginPage.ts' />

import WelcomePage = pages.WelcomePage;
import LoginPage = pages.LoginPage;
import DBUtils = utils.DBUtils;

class EntryPoint {
    private isLoggedIn: boolean;

    constructor() {
        this.initVars();
    }

    private initVars(): void {
        if (window.sessionStorage.getItem('token')) {
            this.isLoggedIn = true;
        }
        DBUtils.getInstance().initDatabase().then(() => {
            this.showCorrespondingPage();
        });
    }

    private showCorrespondingPage(): void {
        if (this.isLoggedIn) {
            new WelcomePage();
        } else {
            new LoginPage();
        }
    }
}

window.onload = () => { new EntryPoint() };
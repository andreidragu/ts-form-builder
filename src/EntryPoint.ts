///<reference path="pages/WelcomePage.ts"/>
///<reference path="pages/LoginPage.ts"/>
///<reference path="utils/DBUtils.ts"/>

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

window.onload = () => {
    new EntryPoint();
};
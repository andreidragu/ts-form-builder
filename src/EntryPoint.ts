/// <reference path="./pages/WelcomePage.ts" />
/// <reference path="./pages/LoginPage.ts" />

import WelcomePage = Pages.WelcomePage;
import LoginPage = Pages.LoginPage;

class EntryPoint {
    private isLoggedIn: boolean;

    constructor() {
        this.initVars();
        this.showCorrespondingPage();
    }

    private initVars(): void {
        if (window.sessionStorage.getItem('token')) {
            this.isLoggedIn = true;
        }
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
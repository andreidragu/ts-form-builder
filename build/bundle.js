var Pages;
(function (Pages) {
    var WelcomePage = /** @class */ (function () {
        function WelcomePage() {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('welcome').style.display = null;
        }
        return WelcomePage;
    }());
    Pages.WelcomePage = WelcomePage;
})(Pages || (Pages = {}));
var Pages;
(function (Pages) {
    var LoginPage = /** @class */ (function () {
        function LoginPage() {
            document.getElementById('loginForm').style.display = null;
            document.getElementById('welcome').style.display = 'none';
        }
        return LoginPage;
    }());
    Pages.LoginPage = LoginPage;
})(Pages || (Pages = {}));
/// <reference path="./pages/WelcomePage" />
/// <reference path="./pages/LoginPage.ts" />
var WelcomePage = Pages.WelcomePage;
var LoginPage = Pages.LoginPage;
var EntryPoint = /** @class */ (function () {
    function EntryPoint() {
        this.initVars();
        this.showCorrespondingPage();
    }
    EntryPoint.prototype.initVars = function () {
        if (window.sessionStorage.getItem('token')) {
            this.isLoggedIn = true;
        }
    };
    EntryPoint.prototype.showCorrespondingPage = function () {
        if (this.isLoggedIn) {
            new WelcomePage();
        }
        else {
            new LoginPage();
        }
    };
    return EntryPoint;
}());
window.onload = function () { new EntryPoint(); };
//# sourceMappingURL=bundle.js.map
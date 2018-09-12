var Utils;
(function (Utils) {
    var FETH_METHOD;
    (function (FETH_METHOD) {
        FETH_METHOD["GET"] = "GET";
        FETH_METHOD["POST"] = "POST";
    })(FETH_METHOD = Utils.FETH_METHOD || (Utils.FETH_METHOD = {}));
    var HttpUtils = /** @class */ (function () {
        function HttpUtils() {
        }
        HttpUtils.fetchInternal = function (url) {
            return fetch(url)
                .then(function (response) {
                if (response.ok) {
                    return response.text();
                }
                else {
                    return 'Something bad happened. Better start debugging!';
                }
            });
        };
        HttpUtils.fetchExternal = function (url, method) {
            return fetch(url, {
                method: method,
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    'Access-Control-Request-Headers': 'content-type'
                }
            })
                .then(function (response) {
                return response.json();
            });
        };
        return HttpUtils;
    }());
    Utils.HttpUtils = HttpUtils;
})(Utils || (Utils = {}));
/// <reference path='../utils/Utils.ts' />
var Pages;
(function (Pages) {
    var HttpUtils = Utils.HttpUtils;
    var WelcomePage = /** @class */ (function () {
        function WelcomePage() {
            HttpUtils.fetchInternal('./welcome.html')
                .then(function (text) {
                document.getElementById('mainContainer').innerHTML = text;
            });
        }
        return WelcomePage;
    }());
    Pages.WelcomePage = WelcomePage;
})(Pages || (Pages = {}));
/// <reference path='../utils/Utils.ts' />
var Pages;
(function (Pages) {
    var HttpUtils = Utils.HttpUtils;
    var LoginPage = /** @class */ (function () {
        function LoginPage() {
            var _this = this;
            HttpUtils.fetchInternal('./login.html')
                .then(function (text) {
                document.getElementById('mainContainer').innerHTML = text;
                _this.initVars();
            });
        }
        LoginPage.prototype.initVars = function () {
            var _this = this;
            this.loginForm = document.querySelector('form');
            this.errorElem = document.getElementById('errorElem');
            this.loginForm.onsubmit = function (ev) {
                var data = new FormData(_this.loginForm);
                var email = data.get('email');
                var password = data.get('password');
                HttpUtils.fetchExternal("https://api.123contactform.com/v2/token?email=" + email + "&password=" + password, Utils.FETH_METHOD.POST)
                    .then(function (data) {
                    if ('error' in data) {
                        _this.handleError(data);
                    }
                    else {
                        _this.handleSuccess(data);
                    }
                });
                ev.preventDefault();
            };
        };
        LoginPage.prototype.handleError = function (data) {
            this.errorElem.textContent = data.error.message;
            this.loginForm.reset();
        };
        LoginPage.prototype.handleSuccess = function (data) {
            window.sessionStorage.setItem('token', data.token);
            document.getElementById('mainContainer').innerHTML = '';
            new Pages.WelcomePage();
        };
        return LoginPage;
    }());
    Pages.LoginPage = LoginPage;
})(Pages || (Pages = {}));
/// <reference path="./pages/WelcomePage.ts" />
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
                    'Content-Type': 'application/json'
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
var Pages;
(function (Pages) {
    var BasePage = /** @class */ (function () {
        function BasePage() {
            this.initVars();
        }
        /**
         * Initialize the variables.
         */
        BasePage.prototype.initVars = function () {
            this.mainContainer = document.getElementById('mainContainer');
            this.loaderElem = document.getElementsByClassName('loader').item(0);
        };
        return BasePage;
    }());
    Pages.BasePage = BasePage;
})(Pages || (Pages = {}));
var core;
(function (core) {
    var http;
    (function (http) {
        var HTTP_REQUEST_TYPE;
        (function (HTTP_REQUEST_TYPE) {
            HTTP_REQUEST_TYPE[HTTP_REQUEST_TYPE["XHR"] = 0] = "XHR";
            HTTP_REQUEST_TYPE[HTTP_REQUEST_TYPE["FETCH"] = 1] = "FETCH";
        })(HTTP_REQUEST_TYPE = http.HTTP_REQUEST_TYPE || (http.HTTP_REQUEST_TYPE = {}));
        var HttpRequestFactory = /** @class */ (function () {
            function HttpRequestFactory() {
            }
            HttpRequestFactory.getInstance = function () {
                if (this._instance === undefined) {
                    this._instance = new HttpRequestFactory();
                }
                return this._instance;
            };
            HttpRequestFactory.prototype.getHttpRequestType = function (httpRequestType) {
                if (httpRequestType === void 0) { httpRequestType = HTTP_REQUEST_TYPE.FETCH; }
                switch (httpRequestType) {
                    case HTTP_REQUEST_TYPE.XHR:
                        return new http.XhrRequest();
                    case HTTP_REQUEST_TYPE.FETCH:
                        return new http.FetchRequest();
                }
            };
            return HttpRequestFactory;
        }());
        http.HttpRequestFactory = HttpRequestFactory;
    })(http = core.http || (core.http = {}));
})(core || (core = {}));
/// <reference path='../core/http/HttpRequestFactory.ts' />
var utils;
(function (utils) {
    var HTTP_REQUEST_TYPE = core.http.HTTP_REQUEST_TYPE;
    var HttpRequestFactory = core.http.HttpRequestFactory;
    /**
     * Singleton class used to make http requests
     */
    var HttpUtils = /** @class */ (function () {
        function HttpUtils() {
            this.httpRequest = HttpRequestFactory.getInstance().getHttpRequestType(HTTP_REQUEST_TYPE.XHR);
        }
        /**
         * HttpUtils single instance object
         */
        HttpUtils.getInstance = function () {
            if (this._instance === undefined) {
                this._instance = new HttpUtils();
            }
            return this._instance;
        };
        HttpUtils.prototype.requestInternal = function (url) {
            return this.httpRequest.requestInternal(url);
        };
        HttpUtils.prototype.requestExternal = function (url) {
            return this.httpRequest.requestExternal(url);
        };
        return HttpUtils;
    }());
    utils.HttpUtils = HttpUtils;
})(utils || (utils = {}));
/// <reference path='BasePage.ts' />
/// <reference path='../utils/Utils.ts' />
/// <reference path='../utils/HttpUtils.ts' />
var Pages;
(function (Pages) {
    var BasePage = Pages.BasePage;
    // import HttpUtils = Utils.HttpUtils;
    var HttpUtils = utils.HttpUtils;
    var LoginPage = /** @class */ (function (_super) {
        __extends(LoginPage, _super);
        function LoginPage() {
            var _this = _super.call(this) || this;
            // HttpUtils.fetchInternal('./login.html')
            //     .then((text: string) => {
            //         this.mainContainer.innerHTML = text;
            //         this.initLoginVars();
            //     });
            HttpUtils.getInstance().requestInternal('./login.html')
                .then(function (text) {
                _this.mainContainer.innerHTML = text;
                _this.initLoginVars();
            });
            return _this;
        }
        /**
         * Initialize Login page variables.
         */
        LoginPage.prototype.initLoginVars = function () {
            this.loginForm = document.querySelector('form');
            this.errorElem = document.getElementById('errorElem');
            this.loginForm.onsubmit = this.onSubmitLoginForm.bind(this);
        };
        /**
         * Bind method to the on submit action for login form.
         *
         * @param ev {Event} login form's event related object
         */
        LoginPage.prototype.onSubmitLoginForm = function (ev) {
            var _this = this;
            this.errorElem.textContent = '';
            var formData = new FormData(this.loginForm);
            var emailForm = formData.get('email');
            var passForm = formData.get('password');
            document.getElementById('loginFormFieldset').disabled = true;
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
            HttpUtils.getInstance().requestExternal("https://api.123contactform.com/v2/token?email=" + emailForm + "&password=" + passForm)
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
        /**
         * Handle response in case of an error.
         *
         * @param data {Response403} error response data containing a status code and a message
         */
        LoginPage.prototype.handleError = function (data) {
            document.getElementById('loginFormFieldset').disabled = false;
            this.mainContainer.removeChild(this.loaderElem);
            this.errorElem.textContent = data.error.message;
            var passElem = document.getElementById('password');
            passElem.value = '';
        };
        /**
         * Handle success response.
         *
         * @param data {Response200} response data containing token in case of succesfull request
         */
        LoginPage.prototype.handleSuccess = function (data) {
            window.sessionStorage.setItem('token', data.token);
            document.getElementById('mainContainer').innerHTML = '';
            this.mainContainer.innerHTML = this.loaderElem.innerHTML;
            new Pages.WelcomePage();
        };
        return LoginPage;
    }(BasePage));
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
var core;
(function (core) {
    var http;
    (function (http) {
        var FetchRequest = /** @class */ (function () {
            function FetchRequest() {
            }
            FetchRequest.prototype.requestInternal = function (url) {
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
            FetchRequest.prototype.requestExternal = function (url) {
                return fetch(url, {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                    .then(function (response) {
                    return response.json();
                });
            };
            return FetchRequest;
        }());
        http.FetchRequest = FetchRequest;
    })(http = core.http || (core.http = {}));
})(core || (core = {}));
var core;
(function (core) {
    var http;
    (function (http) {
        var XhrRequest = /** @class */ (function () {
            function XhrRequest() {
            }
            XhrRequest.prototype.requestInternal = function (url) {
                return new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', url);
                    xhr.onload = function (evt) {
                        resolve(xhr.responseText);
                    };
                    xhr.send();
                });
            };
            XhrRequest.prototype.requestExternal = function (url) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', url);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.onload = function (evt) {
                        resolve(_this.parseXHRResult(xhr));
                    };
                    xhr.send();
                });
            };
            XhrRequest.prototype.parseXHRResult = function (xhr) {
                return JSON.parse(xhr.responseText);
            };
            return XhrRequest;
        }());
        http.XhrRequest = XhrRequest;
    })(http = core.http || (core.http = {}));
})(core || (core = {}));
//# sourceMappingURL=bundle.js.map
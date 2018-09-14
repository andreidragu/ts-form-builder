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
var core;
(function (core) {
    var request;
    (function (request) {
        var HTTP_REQUEST_TYPE;
        (function (HTTP_REQUEST_TYPE) {
            HTTP_REQUEST_TYPE[HTTP_REQUEST_TYPE["XHR"] = 0] = "XHR";
            HTTP_REQUEST_TYPE[HTTP_REQUEST_TYPE["FETCH"] = 1] = "FETCH";
        })(HTTP_REQUEST_TYPE = request.HTTP_REQUEST_TYPE || (request.HTTP_REQUEST_TYPE = {}));
        var HttpRequestFactory = /** @class */ (function () {
            function HttpRequestFactory(httpRequestType) {
                if (httpRequestType === void 0) { httpRequestType = HTTP_REQUEST_TYPE.FETCH; }
                this.httpRequestType = httpRequestType;
            }
            HttpRequestFactory.prototype.getHttpRequestType = function () {
                switch (this.httpRequestType) {
                    case HTTP_REQUEST_TYPE.XHR:
                        return new request.XhrRequest();
                    case HTTP_REQUEST_TYPE.FETCH:
                        return new request.FetchRequest();
                }
            };
            return HttpRequestFactory;
        }());
        request.HttpRequestFactory = HttpRequestFactory;
    })(request = core.request || (core.request = {}));
})(core || (core = {}));
/// <reference path='../core/request/HttpRequestFactory.ts' />
var utils;
(function (utils) {
    var HttpRequestFactory = core.request.HttpRequestFactory;
    var HTTP_REQUEST_TYPE = core.request.HTTP_REQUEST_TYPE;
    /**
     * Singleton class used to make http requests
     */
    var HttpUtils = /** @class */ (function () {
        function HttpUtils() {
            var httpRequestFactory = new HttpRequestFactory(HTTP_REQUEST_TYPE.XHR);
            this.httpRequest = httpRequestFactory.getHttpRequestType();
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
var core;
(function (core) {
    var database;
    (function (database) {
        var ManageDatabase = /** @class */ (function () {
            function ManageDatabase(dbName, osInfos) {
                this.dbName = dbName;
                this.osInfos = osInfos;
                this.dbFactory = window.indexedDB;
            }
            ManageDatabase.prototype.initDB = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var dbReq = _this.dbFactory.open(_this.dbName);
                    dbReq.onupgradeneeded = function () {
                        _this.db = dbReq.result;
                        for (var _i = 0, _a = _this.osInfos; _i < _a.length; _i++) {
                            var osInfo = _a[_i];
                            var params = { keyPath: osInfo.primaryFieldName };
                            var objectStore = _this.db.createObjectStore(osInfo.storeName, params);
                            objectStore.createIndex(osInfo.primaryIndexName, osInfo.primaryFieldName);
                        }
                        var trans = dbReq.transaction;
                        trans.oncomplete = function () {
                            resolve(_this.db);
                        };
                    };
                    dbReq.onsuccess = function () {
                        _this.db = dbReq.result;
                        resolve(_this.db);
                    };
                    dbReq.onerror = function (ev) {
                        reject(ev);
                    };
                });
            };
            return ManageDatabase;
        }());
        database.ManageDatabase = ManageDatabase;
    })(database = core.database || (core.database = {}));
})(core || (core = {}));
var core;
(function (core) {
    var database;
    (function (database) {
        var ManageTable = /** @class */ (function () {
            function ManageTable(db, osInfo) {
                this.db = db;
                this.osInfo = osInfo;
            }
            ManageTable.prototype.addEntity = function (objToAdd) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var trans = _this.db.transaction(_this.osInfo.storeName, 'readwrite');
                    var objectStore = trans.objectStore(_this.osInfo.storeName);
                    var dbReq = objectStore.add(objToAdd);
                    dbReq.onsuccess = function () {
                        resolve();
                    };
                    dbReq.onerror = function (ev) {
                        reject(ev);
                    };
                });
            };
            ManageTable.prototype.updateEntity = function (objToUpdate) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var trans = _this.db.transaction(_this.osInfo.storeName, 'readwrite');
                    var objectStore = trans.objectStore(_this.osInfo.storeName);
                    var dbIndex = objectStore.index(_this.osInfo.primaryIndexName);
                    var dbReq = dbIndex.get(objToUpdate.id);
                    dbReq.onsuccess = function () {
                        var updReq = objectStore.put(objToUpdate);
                        updReq.onsuccess = function () {
                            resolve();
                        };
                        updReq.onerror = function (ev) {
                            reject(ev);
                        };
                    };
                    dbReq.onerror = function (ev) {
                        reject(ev);
                    };
                });
            };
            ManageTable.prototype.readEntity = function (id) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var trans = _this.db.transaction(_this.osInfo.storeName, 'readonly');
                    var objectStore = trans.objectStore(_this.osInfo.storeName);
                    var dbIndex = objectStore.index(_this.osInfo.primaryIndexName);
                    var dbReq = dbIndex.get(id);
                    dbReq.onsuccess = function (obj) {
                        resolve(obj.currentTarget.result);
                    };
                    dbReq.onerror = function (ev) {
                        reject(ev);
                    };
                });
            };
            ManageTable.prototype.getAllEntities = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var trans = _this.db.transaction(_this.osInfo.storeName, 'readonly');
                    var objectStore = trans.objectStore(_this.osInfo.storeName);
                    var dbReq = objectStore.getAll();
                    dbReq.onsuccess = function (obj) {
                        resolve(obj.currentTarget.result);
                    };
                    dbReq.onerror = function (ev) {
                        reject(ev);
                    };
                });
            };
            return ManageTable;
        }());
        database.ManageTable = ManageTable;
    })(database = core.database || (core.database = {}));
})(core || (core = {}));
/// <reference path='../utils/HttpUtils.ts' />
/// <reference path='../core/database/ManageDatabase.ts' />
/// <reference path='../core/database/ManageTable.ts' />
var pages;
(function (pages) {
    var HttpUtils = utils.HttpUtils;
    var ManageDatabase = core.database.ManageDatabase;
    var ManageTable = core.database.ManageTable;
    var WelcomePage = /** @class */ (function () {
        function WelcomePage() {
            HttpUtils.getInstance().requestInternal('./welcome.html')
                .then(function (text) {
                document.getElementById('mainContainer').innerHTML = text;
            });
            var osInfo = {
                storeName: 'TestStore',
                primaryFieldName: 'id',
                primaryIndexName: 'TestIdIndex'
            };
            var md = new ManageDatabase('testDB', [osInfo]);
            md.initDB().then(function (db) {
                var mt = new ManageTable(db, osInfo);
                mt.addEntity(new TestEntity('Test1', 'value1', '1'));
                mt.addEntity(new TestEntity('Test2', 'value2', '2'));
                mt.addEntity(new TestEntity('Test3', 'value3', '3'));
                mt.updateEntity(new TestEntity('Test2Test2', 'value2value2', '2'));
                mt.readEntity('2').then(function (te) {
                    console.log('READ\n' + te.name);
                });
                mt.getAllEntities().then(function (tes) {
                    console.log('READ ALL');
                    for (var _i = 0, tes_1 = tes; _i < tes_1.length; _i++) {
                        var te = tes_1[_i];
                        console.log(te.name);
                    }
                });
            });
        }
        return WelcomePage;
    }());
    pages.WelcomePage = WelcomePage;
    var TestEntity = /** @class */ (function () {
        function TestEntity(name, value, id) {
            this.name = name;
            this.value = value;
            this.id = id;
        }
        return TestEntity;
    }());
})(pages || (pages = {}));
var pages;
(function (pages) {
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
    pages.BasePage = BasePage;
})(pages || (pages = {}));
/// <reference path='BasePage.ts' />
/// <reference path='../utils/HttpUtils.ts' />
var pages;
(function (pages) {
    var BasePage = pages.BasePage;
    var HttpUtils = utils.HttpUtils;
    var LoginPage = /** @class */ (function (_super) {
        __extends(LoginPage, _super);
        function LoginPage() {
            var _this = _super.call(this) || this;
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
            new pages.WelcomePage();
        };
        return LoginPage;
    }(BasePage));
    pages.LoginPage = LoginPage;
})(pages || (pages = {}));
/// <reference path="./pages/WelcomePage.ts" />
/// <reference path="./pages/LoginPage.ts" />
var WelcomePage = pages.WelcomePage;
var LoginPage = pages.LoginPage;
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
        if (!this.isLoggedIn) {
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
    var request;
    (function (request) {
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
        request.FetchRequest = FetchRequest;
    })(request = core.request || (core.request = {}));
})(core || (core = {}));
var core;
(function (core) {
    var request;
    (function (request) {
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
        request.XhrRequest = XhrRequest;
    })(request = core.request || (core.request = {}));
})(core || (core = {}));
//# sourceMappingURL=bundle.js.map
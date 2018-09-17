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
            function HttpRequestFactory() {
            }
            HttpRequestFactory.prototype.getHttpRequestType = function (httpRequestType) {
                if (httpRequestType === void 0) { httpRequestType = HTTP_REQUEST_TYPE.FETCH; }
                switch (httpRequestType) {
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
            var httpRequestFactory = new HttpRequestFactory();
            this.httpRequest = httpRequestFactory.getHttpRequestType(HTTP_REQUEST_TYPE.XHR);
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
                            var params = { keyPath: osInfo.primaryFieldName, autoIncrement: true };
                            var objectStore = _this.db.createObjectStore(osInfo.storeName, params);
                            objectStore.createIndex(osInfo.primaryIndexName, osInfo.primaryFieldName, { unique: true });
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
    var WelcomePage = /** @class */ (function () {
        function WelcomePage() {
            HttpUtils.getInstance().requestInternal('./welcome.html')
                .then(function (text) {
                document.getElementById('mainContainer').innerHTML = text;
            });
            // const osInfo: ObjectStoreInfo = {
            //     storeName: 'TestStore',
            //     primaryFieldName: 'id',
            //     primaryIndexName: 'TestIdIndex'
            // };
            // const md: ManageDatabase = new ManageDatabase('testDB', [osInfo]);
            // md.initDB().then((db: IDBDatabase) => {
            //     const mt: ManageTable<TestEntity> = new ManageTable<TestEntity>(db, osInfo);
            //     mt.addEntity(new TestEntity('Test1', 'value1', '1'));
            //     mt.addEntity(new TestEntity('Test2', 'value2', '2'));
            //     mt.addEntity(new TestEntity('Test3', 'value3', '3'));
            //     mt.updateEntity(new TestEntity('Test2Test2', 'value2value2', '2'));
            //     mt.readEntity('2').then((te: TestEntity) => {
            //         console.log('READ\n' + te.name);
            //     });
            //     mt.getAllEntities().then((tes: TestEntity[]) => {
            //         console.log('READ ALL');
            //         for (const te of tes) {
            //             console.log(te.name);
            //         }
            //     });
            // });
        }
        return WelcomePage;
    }());
    pages.WelcomePage = WelcomePage;
    // class TestEntity {
    //     constructor(public name: string, public value: string, public id: string) { }
    // }
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
var utils;
(function (utils) {
    var ManageDatabase = core.database.ManageDatabase;
    var ManageTable = core.database.ManageTable;
    var DBUtils = /** @class */ (function () {
        function DBUtils() {
        }
        /**
         * DBUtils single instance object
         */
        DBUtils.getInstance = function () {
            if (this._instance === undefined) {
                this._instance = new DBUtils();
            }
            return this._instance;
        };
        DBUtils.prototype.initDatabase = function () {
            var _this = this;
            var osInfo = {
                primaryFieldName: 'LoginId',
                primaryIndexName: 'LoginIdIndex',
                storeName: 'LoginStore'
            };
            var md = new ManageDatabase('tsFormBuilderDB', [osInfo]);
            return new Promise(function (resolve, reject) {
                md.initDB()
                    .then(function (db) {
                    _this._manageLoginTable = new ManageTable(db, osInfo);
                    resolve();
                })
                    .catch(function (ev) {
                    reject(ev);
                });
            });
        };
        Object.defineProperty(DBUtils.prototype, "manageLoginTable", {
            get: function () {
                if (this._manageLoginTable) {
                    return this._manageLoginTable;
                }
                else {
                    throw new Error('Please initialize database in your EntryPoint class');
                }
            },
            enumerable: true,
            configurable: true
        });
        return DBUtils;
    }());
    utils.DBUtils = DBUtils;
})(utils || (utils = {}));
var core;
(function (core) {
    var database;
    (function (database) {
        var LoginEntity = /** @class */ (function () {
            function LoginEntity() {
                this.nrOfFailedTries = 0;
                this.loginDates = [];
                this.isLockedOut = false;
            }
            return LoginEntity;
        }());
        database.LoginEntity = LoginEntity;
    })(database = core.database || (core.database = {}));
})(core || (core = {}));
/// <reference path='BasePage.ts' />
/// <reference path='../utils/DBUtils.ts' />
/// <reference path='../core/database/LoginEntity.ts' />
/// <reference path='../utils/HttpUtils.ts' />
var pages;
(function (pages) {
    var BasePage = pages.BasePage;
    var DBUtils = utils.DBUtils;
    var LoginEntity = core.database.LoginEntity;
    var HttpUtils = utils.HttpUtils;
    var LoginPage = /** @class */ (function (_super) {
        __extends(LoginPage, _super);
        function LoginPage() {
            var _this = _super.call(this) || this;
            DBUtils.getInstance().manageLoginTable.getAllEntities()
                .then(function (loginEntities) {
                _this.loginEntities = loginEntities;
                HttpUtils.getInstance().requestInternal('./login.html')
                    .then(function (text) {
                    _this.mainContainer.innerHTML = text;
                    _this.initLoginVars();
                });
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
            var loginEntity = this.loginEntities.find(function (obj) {
                return obj.email === emailForm.toString();
            });
            if (loginEntity && loginEntity.isLockedOut) {
                loginEntity.loginDates.push("Locked on: " + new Date().toDateString());
                DBUtils.getInstance().manageLoginTable.updateEntity(loginEntity)
                    .then(function () {
                    _this.handleError({ error: { message: 'This user is locked. Too many tries!' } });
                    ev.preventDefault();
                    return;
                });
            }
            else if (!loginEntity) {
                loginEntity = new LoginEntity();
                loginEntity.id = loginEntity.email = emailForm.toString();
                this.loginEntities.push(loginEntity);
            }
            HttpUtils.getInstance().requestExternal("https://api.123contactform.com/v2/token?email=" + emailForm + "&password=" + passForm)
                .then(function (data) {
                if ('error' in data) {
                    loginEntity.nrOfFailedTries++;
                    if (loginEntity.nrOfFailedTries === 5) {
                        loginEntity.isLockedOut = true;
                    }
                    DBUtils.getInstance().manageLoginTable.updateEntity(loginEntity)
                        .then(function () {
                        if (loginEntity.isLockedOut) {
                            _this.handleError({ error: { message: 'This user is locked. Too many tries!' } });
                        }
                        else {
                            _this.handleError(data);
                        }
                    });
                }
                else {
                    DBUtils.getInstance().manageLoginTable.updateEntity(loginEntity)
                        .then(function () {
                        _this.handleSuccess(data);
                    });
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
/// <reference path='./pages/WelcomePage.ts' />
/// <reference path='./pages/LoginPage.ts' />
/// <reference path='./utils/DBUtils.ts' />
var WelcomePage = pages.WelcomePage;
var LoginPage = pages.LoginPage;
var DBUtils = utils.DBUtils;
var EntryPoint = /** @class */ (function () {
    function EntryPoint() {
        this.initVars();
    }
    EntryPoint.prototype.initVars = function () {
        var _this = this;
        if (window.sessionStorage.getItem('token')) {
            this.isLoggedIn = true;
        }
        DBUtils.getInstance().initDatabase().then(function () {
            _this.showCorrespondingPage();
        });
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
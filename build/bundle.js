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
///<reference path="../core/request/HttpRequestFactory.ts"/>
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
        HttpUtils.prototype.requestExternal = function (url, method) {
            return this.httpRequest.requestExternal(url, method);
        };
        return HttpUtils;
    }());
    utils.HttpUtils = HttpUtils;
})(utils || (utils = {}));
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
                if (this.db) {
                    this.db.close();
                }
                return new Promise(function (resolve, reject) {
                    var dbReq = _this.dbFactory.open(_this.dbName);
                    dbReq.onupgradeneeded = function () {
                        _this.db = dbReq.result;
                        for (var _i = 0, _a = _this.osInfos; _i < _a.length; _i++) {
                            var osInfo = _a[_i];
                            var params = {
                                keyPath: osInfo.primaryFieldName,
                                autoIncrement: true
                            };
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
                    var dbReq = dbIndex.get(objToUpdate[_this.osInfo.primaryFieldName]);
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
///<reference path="../core/database/ManageDatabase.ts"/>
///<reference path="../core/database/ManageTable.ts"/>
var utils;
(function (utils) {
    var ManageDatabase = core.database.ManageDatabase;
    var ManageTable = core.database.ManageTable;
    var DBUtils = /** @class */ (function () {
        function DBUtils() {
            // singleton class
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
            var loginStoreInfo = {
                storeName: 'LoginStore',
                primaryFieldName: 'email',
                primaryIndexName: 'emailIndex'
            };
            var formStoreInfo = {
                storeName: 'FormStore',
                primaryFieldName: 'id',
                primaryIndexName: 'idIndex'
            };
            var md = new ManageDatabase('tsFormBuilderDB', [loginStoreInfo, formStoreInfo]);
            return new Promise(function (resolve, reject) {
                md.initDB()
                    .then(function (db) {
                    _this._manageLoginTable = new ManageTable(db, loginStoreInfo);
                    _this._manageFormTable = new ManageTable(db, formStoreInfo);
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
        Object.defineProperty(DBUtils.prototype, "manageFormTable", {
            get: function () {
                if (this._manageFormTable) {
                    return this._manageFormTable;
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
///<reference path="../utils/HttpUtils.ts"/>
///<reference path="BasePage.ts"/>
///<reference path="../utils/DBUtils.ts"/>
var pages;
(function (pages) {
    var DBUtils = utils.DBUtils;
    var HttpUtils = utils.HttpUtils;
    var WelcomePage = /** @class */ (function (_super) {
        __extends(WelcomePage, _super);
        function WelcomePage() {
            var _this = _super.call(this) || this;
            DBUtils.getInstance().manageFormTable.getAllEntities()
                .then(function (formEntities) {
                _this.formEntities = formEntities;
                HttpUtils.getInstance().requestInternal('./pages/welcome.html')
                    .then(function (text) {
                    document.getElementById('mainContainer').innerHTML = text;
                    document.getElementById('inputSearchWhere').disabled = true;
                    document.getElementById('inputSearchTYpe').disabled = true;
                    document.getElementById('searchForm').querySelector('input').disabled = true;
                    document.getElementById('searchForm').querySelector('button').disabled = true;
                    _this.mainContainer.appendChild(_this.loaderElem);
                    _this.getAllFormsAndSubmissions().then(function (formEntities) {
                        _this.formEntities = formEntities;
                        for (var _i = 0, formEntities_1 = formEntities; _i < formEntities_1.length; _i++) {
                            var formEntity = formEntities_1[_i];
                            DBUtils.getInstance().manageFormTable.updateEntity(formEntity);
                        }
                        _this.mainContainer.removeChild(_this.loaderElem);
                        document.getElementById('inputSearchWhere').disabled = false;
                        document.getElementById('inputSearchTYpe').disabled = false;
                        document.getElementById('searchForm').querySelector('input').disabled = false;
                        document.getElementById('searchForm').querySelector('button').disabled = false;
                        _this.initWelcomeVars();
                    });
                    // debug
                    // this.initWelcomeVars();
                });
            });
            return _this;
        }
        WelcomePage.prototype.initWelcomeVars = function () {
            this.tableDataAll = [];
            this.welcomeTable = document.getElementById('welcomeTable');
            this.searchForm = document.getElementById('searchForm');
            this.inputSearchWhere = document.getElementById('inputSearchWhere');
            this.inputSearchTYpe = document.getElementById('inputSearchTYpe');
            this.initTableData();
            this.populateTableData(this.tableDataAll);
            this.searchForm.onsubmit = this.onSubmitSearchForm.bind(this);
        };
        WelcomePage.prototype.onSubmitSearchForm = function (ev) {
            var _this = this;
            var formData = new FormData(this.searchForm);
            var searchValue = formData.get('searchValue').toLowerCase();
            var searchWhere = this.inputSearchWhere.options[this.inputSearchWhere.selectedIndex];
            var searchType = this.inputSearchTYpe.options[this.inputSearchTYpe.selectedIndex];
            if (searchValue === '') {
                this.populateTableData(this.tableDataAll);
            }
            else {
                var fullMatch_1 = searchType.value === '2';
                var filteredTableData = this.tableDataAll.filter(function (tableData) {
                    if (searchWhere.value === "1") {
                        return _this.foundAll(searchValue, tableData, fullMatch_1);
                    }
                    else if (searchWhere.value === "2") {
                        return _this.foundName(searchValue, tableData, fullMatch_1);
                    }
                    else {
                        return _this.foundEmail(searchValue, tableData, fullMatch_1);
                    }
                });
                this.populateTableData(filteredTableData);
            }
            ev.preventDefault();
        };
        WelcomePage.prototype.foundAll = function (searchValue, tableData, fullMatch) {
            if (fullMatch) {
                return tableData.name.toLowerCase() === searchValue ||
                    tableData.email.toLowerCase() === searchValue ||
                    tableData.phone.toLowerCase() === searchValue;
            }
            else {
                return tableData.name.toLowerCase().includes(searchValue) ||
                    tableData.email.toLowerCase().includes(searchValue) ||
                    tableData.phone.toLowerCase().includes(searchValue);
            }
        };
        WelcomePage.prototype.foundName = function (searchValue, tableData, fullMatch) {
            if (fullMatch) {
                return tableData.name.toLowerCase() === searchValue;
            }
            else {
                return tableData.name.toLowerCase().includes(searchValue);
            }
        };
        WelcomePage.prototype.foundEmail = function (searchValue, tableData, fullMatch) {
            if (fullMatch) {
                return tableData.email.toLowerCase() === searchValue;
            }
            else {
                return tableData.email.toLowerCase().includes(searchValue);
            }
        };
        WelcomePage.prototype.initTableData = function () {
            for (var _i = 0, _a = this.formEntities; _i < _a.length; _i++) {
                var formEntity = _a[_i];
                var controls = formEntity.fields.controls.data;
                for (var _b = 0, _c = formEntity.submissions; _b < _c.length; _b++) {
                    var submissionEntity = _c[_b];
                    var canPush = false;
                    var tableData = {
                        name: '-',
                        email: '-',
                        phone: '-'
                    };
                    var fields = submissionEntity.content.fields.field;
                    var _loop_1 = function (field) {
                        var control = controls.find(function (obj) {
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
                    };
                    for (var _d = 0, fields_1 = fields; _d < fields_1.length; _d++) {
                        var field = fields_1[_d];
                        _loop_1(field);
                    }
                    if (canPush) {
                        this.tableDataAll.push(tableData);
                    }
                }
            }
        };
        WelcomePage.prototype.populateTableData = function (tableData) {
            var rowsLength = this.welcomeTable.rows.length;
            for (var i = 1; i < rowsLength - 1; i++) {
                this.welcomeTable.deleteRow(1);
            }
            var feLength = tableData.length;
            for (var i = 0; i < feLength; i++) {
                var row = this.welcomeTable.insertRow(i + 1);
                var name_1 = row.insertCell(0);
                var email = row.insertCell(1);
                var phone = row.insertCell(2);
                name_1.textContent = tableData[i].name;
                email.textContent = tableData[i].email;
                phone.textContent = tableData[i].phone;
            }
        };
        WelcomePage.prototype.getAllFormsAndSubmissions = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                HttpUtils.getInstance().requestExternal("https://api.123contactform.com/v2/forms?JWT=" + window.sessionStorage.getItem('token'), 'GET')
                    .then(function (formData) {
                    if ('error' in formData) {
                        console.log(formData.error.message);
                        reject(formData);
                    }
                    else {
                        var formEntities_2 = formData.data;
                        var totalNrOfForms_1 = formData.meta.pagination.total;
                        var _loop_2 = function (i) {
                            var oldFormEntity = _this.formEntities.find(function (obj) {
                                return obj.id === formEntities_2[i].id;
                            });
                            if (oldFormEntity === undefined || (oldFormEntity !== undefined &&
                                Date.parse(oldFormEntity.latest_submission.date) < Date.parse(formEntities_2[i].latest_submission.date))) {
                                HttpUtils.getInstance().requestExternal("https://api.123contactform.com/v2/forms/" + formEntities_2[i].id + "/submissions?JWT=" + window.sessionStorage.getItem('token'), 'GET')
                                    .then(function (submissionsData) {
                                    if ('error' in submissionsData) {
                                        console.log(submissionsData.error.message);
                                        reject(submissionsData);
                                    }
                                    else {
                                        formEntities_2[i].submissions = submissionsData.data;
                                        HttpUtils.getInstance().requestExternal("https://api.123contactform.com/v2/forms/" + formEntities_2[i].id + "/fields?JWT=" + window.sessionStorage.getItem('token'), 'GET')
                                            .then(function (fieldsData) {
                                            if ('error' in fieldsData) {
                                                console.log(fieldsData.error.message);
                                                reject(fieldsData);
                                            }
                                            else {
                                                formEntities_2[i].fields = fieldsData.data;
                                                if (i === totalNrOfForms_1 - 1) {
                                                    resolve(formEntities_2);
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                formEntities_2[i].submissions = _this.formEntities[i].submissions;
                                formEntities_2[i].fields = _this.formEntities[i].fields;
                                if (i === totalNrOfForms_1 - 1) {
                                    resolve(formEntities_2);
                                }
                            }
                        };
                        for (var i = 0; i < totalNrOfForms_1; i++) {
                            _loop_2(i);
                        }
                    }
                });
            });
        };
        return WelcomePage;
    }(pages.BasePage));
    pages.WelcomePage = WelcomePage;
})(pages || (pages = {}));
var core;
(function (core) {
    var database;
    (function (database) {
        var dao;
        (function (dao) {
            var LoginEntity = /** @class */ (function () {
                function LoginEntity() {
                    this.nrOfFailedTries = 0;
                    this.loginDates = [];
                    this.isLockedOut = false;
                }
                return LoginEntity;
            }());
            dao.LoginEntity = LoginEntity;
        })(dao = database.dao || (database.dao = {}));
    })(database = core.database || (core.database = {}));
})(core || (core = {}));
///<reference path="../core/database/dao/LoginEntity.ts"/>
///<reference path="../utils/HttpUtils.ts"/>
///<reference path="BasePage.ts"/>
var pages;
(function (pages) {
    var LoginEntity = core.database.dao.LoginEntity;
    var DBUtils = utils.DBUtils;
    var HttpUtils = utils.HttpUtils;
    var BasePage = pages.BasePage;
    var LoginPage = /** @class */ (function (_super) {
        __extends(LoginPage, _super);
        function LoginPage() {
            var _this = _super.call(this) || this;
            DBUtils.getInstance().manageLoginTable.getAllEntities()
                .then(function (loginEntities) {
                _this.loginEntities = loginEntities;
                HttpUtils.getInstance().requestInternal('./pages/login.html')
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
            this.loginFormFieldSet = document.getElementById('loginFormFieldSet');
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
            this.loginFormFieldSet.disabled = true;
            this.mainContainer.appendChild(this.loaderElem);
            //----------------------------------------------------------------------------------------------------
            var loginEntity = this.loginEntities.find(function (obj) {
                return obj.email === emailForm.toString();
            });
            if (loginEntity && loginEntity.isLockedOut) {
                loginEntity.loginDates.push("Locked out: " + new Date().toISOString());
                DBUtils.getInstance().manageLoginTable.updateEntity(loginEntity)
                    .then(function () {
                    _this.handleError({ error: { message: 'This user is locked. Too many tries!' } });
                });
                ev.preventDefault();
                return;
            }
            else if (!loginEntity) {
                loginEntity = new LoginEntity();
                loginEntity.email = emailForm.toString();
                this.loginEntities.push(loginEntity);
            }
            //----------------------------------------------------------------------------------------------------
            HttpUtils.getInstance().requestExternal("https://api.123contactform.com/v2/token?email=" + emailForm + "&password=" + passForm)
                .then(function (data) {
                if ('error' in data) {
                    loginEntity.nrOfFailedTries++;
                    if (loginEntity.nrOfFailedTries === 5) {
                        loginEntity.isLockedOut = true;
                    }
                    loginEntity.loginDates.push("Failed on: " + new Date().toISOString());
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
                    loginEntity.loginDates.push("Sucefull on: " + new Date().toISOString());
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
            this.loginFormFieldSet.disabled = false;
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
            new pages.WelcomePage();
        };
        return LoginPage;
    }(BasePage));
    pages.LoginPage = LoginPage;
})(pages || (pages = {}));
///<reference path="pages/WelcomePage.ts"/>
///<reference path="pages/LoginPage.ts"/>
///<reference path="utils/DBUtils.ts"/>
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
window.onload = function () {
    new EntryPoint();
};
var core;
(function (core) {
    var database;
    (function (database) {
        var dao;
        (function (dao) {
            var ControlEntity = /** @class */ (function () {
                function ControlEntity() {
                }
                return ControlEntity;
            }());
            dao.ControlEntity = ControlEntity;
        })(dao = database.dao || (database.dao = {}));
    })(database = core.database || (core.database = {}));
})(core || (core = {}));
var core;
(function (core) {
    var database;
    (function (database) {
        var dao;
        (function (dao) {
            var FieldsEntity = /** @class */ (function () {
                function FieldsEntity() {
                }
                return FieldsEntity;
            }());
            dao.FieldsEntity = FieldsEntity;
        })(dao = database.dao || (database.dao = {}));
    })(database = core.database || (core.database = {}));
})(core || (core = {}));
var core;
(function (core) {
    var database;
    (function (database) {
        var dao;
        (function (dao) {
            var FormEntity = /** @class */ (function () {
                function FormEntity() {
                }
                return FormEntity;
            }());
            dao.FormEntity = FormEntity;
        })(dao = database.dao || (database.dao = {}));
    })(database = core.database || (core.database = {}));
})(core || (core = {}));
var core;
(function (core) {
    var database;
    (function (database) {
        var dao;
        (function (dao) {
            var SubmissionEntity = /** @class */ (function () {
                function SubmissionEntity() {
                }
                return SubmissionEntity;
            }());
            dao.SubmissionEntity = SubmissionEntity;
        })(dao = database.dao || (database.dao = {}));
    })(database = core.database || (core.database = {}));
})(core || (core = {}));
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
            FetchRequest.prototype.requestExternal = function (url, method) {
                if (method === void 0) { method = 'POST'; }
                return fetch(url, {
                    method: method,
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
            XhrRequest.prototype.requestExternal = function (url, method) {
                var _this = this;
                if (method === void 0) { method = 'POST'; }
                return new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest();
                    xhr.open(method, url);
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
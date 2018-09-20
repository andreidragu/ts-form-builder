///<reference path="../core/database/ManageDatabase.ts"/>
///<reference path="../core/database/ManageTable.ts"/>

module utils {
    import ObjectStoreInfo = core.database.ObjectStoreInfo;
    import ManageDatabase = core.database.ManageDatabase;
    import ManageTable = core.database.ManageTable;
    import LoginEntity = core.database.dao.LoginEntity;
    import FormEntity = core.database.dao.FormEntity;

    export class DBUtils {
        private static _instance: DBUtils;

        private _manageLoginTable: ManageTable<LoginEntity>;
        private _manageFormTable: ManageTable<FormEntity>;

        private constructor() {
            // singleton class
        }

        /**
         * DBUtils single instance object
         */
        public static getInstance(): DBUtils {
            if (this._instance === undefined) {
                this._instance = new DBUtils();
            }
            return this._instance;
        }

        public initDatabase(): Promise<void> {
            const loginStoreInfo: ObjectStoreInfo = {
                storeName: 'LoginStore',
                primaryFieldName: 'email',
                primaryIndexName: 'emailIndex'
            };
            const formStoreInfo: ObjectStoreInfo = {
                storeName: 'FormStore',
                primaryFieldName: 'id',
                primaryIndexName: 'idIndex'
            };
            const md: ManageDatabase = new ManageDatabase('tsFormBuilderDB', [loginStoreInfo, formStoreInfo]);
            return new Promise<void>((resolve: Function, reject: Function) => {
                md.initDB()
                    .then((db: IDBDatabase) => {
                        this._manageLoginTable = new ManageTable<LoginEntity>(db, loginStoreInfo);
                        this._manageFormTable = new ManageTable<FormEntity>(db, formStoreInfo);
                        resolve();
                    })
                    .catch((ev: Event) => {
                        reject(ev);
                    });
            });
        }

        public get manageLoginTable(): ManageTable<LoginEntity> {
            if (this._manageLoginTable) {
                return this._manageLoginTable;
            } else {
                throw new Error('Please initialize database in your EntryPoint class');
            }
        }

        public get manageFormTable(): ManageTable<FormEntity> {
            if (this._manageFormTable) {
                return this._manageFormTable;
            } else {
                throw new Error('Please initialize database in your EntryPoint class');
            }
        }
    }
}
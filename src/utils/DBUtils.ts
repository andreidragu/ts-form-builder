module utils {
    import ObjectStoreInfo = core.database.ObjectStoreInfo;
    import ManageDatabase = core.database.ManageDatabase;
    import ManageTable = core.database.ManageTable;
    import LoginEntity = core.database.LoginEntity;

    export class DBUtils {
        private static _instance: DBUtils;

        private _manageLoginTable: ManageTable<LoginEntity>;

        private constructor() { }

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
                primaryFieldName: 'email',
                primaryIndexName: 'emailIndex',
                storeName: 'LoginStore'
            };
            const md: ManageDatabase = new ManageDatabase('tsFormBuilderDB', [loginStoreInfo]);
            return new Promise<void>((resolve: Function, reject: Function) => {
                md.initDB()
                    .then((db: IDBDatabase) => {
                        this._manageLoginTable = new ManageTable<LoginEntity>(db, loginStoreInfo);
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
    }
}
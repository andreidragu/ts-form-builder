module core.database {
    export class ManageDatabase {
        private dbName: string;
        private osInfos: ObjectStoreInfo[];
        private dbFactory: IDBFactory;
        private db: IDBDatabase;

        constructor(dbName: string, osInfos: ObjectStoreInfo[]) {
            this.dbName = dbName;
            this.osInfos = osInfos;
            this.dbFactory = window.indexedDB;
        }

        public initDB(): Promise<IDBDatabase> {
            return new Promise<IDBDatabase>((resolve: Function, reject: Function) => {
                const dbReq: IDBOpenDBRequest = this.dbFactory.open(this.dbName);

                dbReq.onupgradeneeded = () => {
                    this.db = dbReq.result;
                    for (const osInfo of this.osInfos) {
                        const params: IDBObjectStoreParameters = { keyPath: osInfo.primaryFieldName };
                        const objectStore: IDBObjectStore = this.db.createObjectStore(osInfo.storeName, params);
                        objectStore.createIndex(osInfo.primaryIndexName, osInfo.primaryFieldName);
                    }

                    const trans: IDBTransaction = dbReq.transaction;
                    trans.oncomplete = () => {
                        resolve(this.db);
                    };
                };

                dbReq.onsuccess = () => {
                    this.db = dbReq.result;
                    resolve(this.db);
                };

                dbReq.onerror = (ev: Event) => {
                    reject(ev);
                };
            });
        }
    }
}
module core.database {
    export class ManageTable<T extends { id: string }> {
        private db: IDBDatabase;
        private osInfo: ObjectStoreInfo;

        constructor(db: IDBDatabase, osInfo: ObjectStoreInfo) {
            this.db = db;
            this.osInfo = osInfo;
        }

        public addEntity(objToAdd: T): Promise<void> {
            return new Promise<void>((resolve: Function, reject: Function) => {
                const trans: IDBTransaction = this.db.transaction(this.osInfo.storeName, 'readwrite');
                const objectStore: IDBObjectStore = trans.objectStore(this.osInfo.storeName);
                const dbReq: IDBRequest = objectStore.add(objToAdd);

                dbReq.onsuccess = () => {
                    resolve();
                };

                dbReq.onerror = (ev: Event) => {
                    reject(ev);
                }
            });
        }

        public updateEntity(objToUpdate: T): Promise<void> {
            return new Promise<void>((resolve: Function, reject: Function) => {
                const trans: IDBTransaction = this.db.transaction(this.osInfo.storeName, 'readwrite');
                const objectStore: IDBObjectStore = trans.objectStore(this.osInfo.storeName);
                const dbIndex: IDBIndex = objectStore.index(this.osInfo.primaryIndexName);
                const dbReq: IDBRequest = dbIndex.get(objToUpdate.id);

                dbReq.onsuccess = () => {
                    const updReq: IDBRequest = objectStore.put(objToUpdate);

                    updReq.onsuccess = () => {
                        resolve();
                    };

                    updReq.onerror = (ev: Event) => {
                        reject(ev);
                    };
                };

                dbReq.onerror = (ev: Event) => {
                    reject(ev);
                };
            });
        }

        public readEntity(id: string): Promise<T> {
            return new Promise<T>((resolve: Function, reject: Function) => {
                const trans: IDBTransaction = this.db.transaction(this.osInfo.storeName, 'readonly');
                const objectStore: IDBObjectStore = trans.objectStore(this.osInfo.storeName);
                const dbIndex: IDBIndex = objectStore.index(this.osInfo.primaryIndexName);
                const dbReq: IDBRequest = dbIndex.get(id);

                dbReq.onsuccess = (obj: any) => {
                    resolve(obj.currentTarget.result);
                };

                dbReq.onerror = (ev: Event) => {
                    reject(ev);
                };
            });
        }

        public getAllEntities(): Promise<T[]> {
            return new Promise<any>((resolve: Function, reject: Function) => {
                const trans: IDBTransaction = this.db.transaction(this.osInfo.storeName, 'readonly');
                const objectStore: IDBObjectStore = trans.objectStore(this.osInfo.storeName);
                const dbReq: IDBRequest = (<any>objectStore).getAll();

                dbReq.onsuccess = (obj: any) => {
                    resolve(obj.currentTarget.result);
                };

                dbReq.onerror = (ev: Event) => {
                    reject(ev);
                };
            });
        }
    }
}
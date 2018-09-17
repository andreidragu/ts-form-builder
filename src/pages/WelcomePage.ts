/// <reference path='../utils/HttpUtils.ts' />
/// <reference path='../core/database/ManageDatabase.ts' />
/// <reference path='../core/database/ManageTable.ts' />

module pages {
    import HttpUtils = utils.HttpUtils;
    import ObjectStoreInfo = core.database.ObjectStoreInfo;
    import ManageDatabase = core.database.ManageDatabase;
    import ManageTable = core.database.ManageTable;

    export class WelcomePage {
        constructor() {
            HttpUtils.getInstance().requestInternal('./welcome.html')
                .then((text: string) => {
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
    }

    // class TestEntity {
    //     constructor(public name: string, public value: string, public id: string) { }
    // }
}
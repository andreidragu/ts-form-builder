module core.database {
    export class LoginEntity {
        public id: string;
        public email: string;
        public nrOfFailedTries: number = 0;
        public loginDates: string[] = [];
        public isLockedOut: boolean = false;
    }
}
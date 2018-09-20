module core.database.dao {
    export class SubmissionEntity {
        id: number;
        form_id: number;
        entry_id: number;
        country: string;
        deleted: number;
        status: number;
        payed: number;
        approved: number;
        date: string;
        content: {
            [key: string]: any;
        };
        recipients: object;

        [key: string]: any;
    }
}
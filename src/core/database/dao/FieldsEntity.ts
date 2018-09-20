module core.database.dao {
    export class FieldsEntity {
        id: number;
        name: string;
        group_id: number;
        user_id: number;
        submissions_count: number;
        submissions_count_month: number;
        latest_submission: {
            id: number;
            date: string;
        };
        created_by: number;
        controls: {
            data: ControlEntity[];
        };

        [key: string]: any;
    }
}
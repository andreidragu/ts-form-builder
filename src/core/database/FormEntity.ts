module core.database {
    export class FormEntity {
        id: number;
        name: string;
        group_id: number;
        user_id: number;
        submissions: SubmissionEntity[];
        submissions_count: number;
        submissions_count_month: number;
        latest_submission: {
            id: number;
            date: string;
        };
        created_by: number;
        active: number;
        active_date_from: string;
        active_date_to: string;
        active_days: string;
        [key: string]: any;
    }
}
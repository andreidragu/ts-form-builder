module core.database.dao {
    export class ControlEntity {
        id: number;
        form_id: number;
        name: string;
        instruction: string;
        position: number;
        type: number;
        subtype: number;
        required: number;
        values: string;
        hidden: number;
        other_value: number;
        hide_label: number;
        validation: number;
        width: number;
        height: number;

        [key: string]: any;
    }
}
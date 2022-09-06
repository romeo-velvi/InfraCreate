export class DataInputElement{
    element: Array<DataInputSelection | DataInputCheck | DataInputText>;
}

export class DataInput{
    id: string;
    text?: string;
    type: "textarea" | "text" | "selection" | "checkbox";
    data_prepended?: string;
    data_appended?: string;
    required: boolean;
}
export class DataInputText extends DataInput{
    placeholder?: string;
}
export class DataInputSelection extends DataInput{
    multiple?: boolean;
    selected_number: number;
    selection: SelectOption[];
}
export class DataInputCheck  extends DataInput{
    checked?: boolean;
}

export class SelectOption{
    value: string;
    text: string;
    other?: any;
}

export class DataInputReturned{
    element: { [key:string]: SingleDataInputReturned};
    isValid: boolean;
    exitStatus?: 'submitted' | 'cancel' | 'error';
}

export class SingleDataInputReturned{
    id: string;
    text: string;
    type: string;
    value: any;
}

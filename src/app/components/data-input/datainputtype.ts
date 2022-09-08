/** 
 * Tipo di dato passato alla componente DataInput
 * @see {DataInputComponet}
 */
export class DataInputElement{
    element: Array<DataInputSelection | DataInputCheck | DataInputText>;
}

/**
 * Tipo di dato Input contenente variabili generali.
 * @see {DataInputComponet}
 */
export class DataInput{
    id: string;
    text?: string;
    type: "textarea" | "text" | "selection" | "checkbox";
    data_prepended?: string;
    data_appended?: string;
    required: boolean;
}
/**
 * Tipo input text base/area.
 * Estende DataInput.
  * @see {DataInputComponet}
 */
export class DataInputText extends DataInput{
    placeholder?: string;
}
/**
 * Tipo input selection.
 * Estende DataInput.
  * @see {DataInputComponet}
 */
export class DataInputSelection extends DataInput{
    multiple?: boolean;
    selected_number: number;
    selection: SelectOption[];
}
/**
 * Tipo input check (toggle).
 * Estende DataInput.
 * @see {DataInputComponet}
 */
export class DataInputCheck  extends DataInput{
    checked?: boolean;
}

/**
 * Tipo usato per le selezioni (multiselect option).
  * @see {DataInputComponet}
 */
export class SelectOption{
    value: string;
    text: string;
    other?: any;
}

/**
 * Tipo di ritorno della componente DataInputReturned.
  * @see {DataInputComponet}
 */
export class DataInputReturned{
    element: { [key:string]: SingleDataInputReturned};
    isValid: boolean;
    exitStatus?: 'submitted' | 'cancel' | 'error';
}
/**
 * Singolo elemento dato in ritorno al submit.
  * @see {DataInputComponet}
 */
export class SingleDataInputReturned{
    id: string;
    text: string;
    type: string;
    value: any;
}

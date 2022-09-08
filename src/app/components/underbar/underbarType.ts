import { TemplateRef } from "@angular/core";
/**
 * Funzione usata come input per la componente UnderbarComponent.
 * @see {UnderbarComponent}
 */
export class UnderbarElement {
    element: UnderbarItem[];
}

/**
 * Elemento singolo per l'underbar.
 * Usato anche come ritorno.
 * @see {UnderbarComponent}
 */
export class UnderbarItem {
    id: string;
    type: "separator" | "template" | "button";
    button?: {
        iconClass: string
        tooltipText: string
    } 
    template?: TemplateRef<any>;
}

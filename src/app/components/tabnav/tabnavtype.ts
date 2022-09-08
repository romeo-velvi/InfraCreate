import { TemplateRef } from "@angular/core";

/**
 * Elemento utilizzato come input dalla componente TabnavComponent
 * @see {TabnavComponent}
 */
export class TabnavElement {
    element: TabnavItem[];
}

/**
 * Elemento che rappresenta una singola tab.
 * @see {TabnavComponent}
 */
export class TabnavItem {
    id: string;
    text: string;
    template: TemplateRef<any>
}
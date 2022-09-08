import { TemplateRef } from "@angular/core";

/**
 * Elemento passato come parametro alla componente NavbarComponent
 */
export class NavbarElement {
    template_title?: TemplateRef<any>;
    type: "module" | "theater";
    logo_img?: any;
    element: NavbarItem[];
}

/**
 * Oggetto che rappresenta un singolo elemento della Navbar
 */
export class NavbarItem{
    id: string;
    text: string;
    a_option?: Aoption[];
    template?: TemplateRef<any>;
}

/**
 * Rappresenta le opzioni per il tag <a>
 */
export class Aoption {
    attr_key: string;
    attr_val: string;
}
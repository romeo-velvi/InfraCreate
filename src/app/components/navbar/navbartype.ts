import { TemplateRef } from "@angular/core";

export class NavbarElement {
    template_title?: TemplateRef<any>;
    type: "module" | "theater";
    logo_img?: any;
    element: NavbarItem[];
}

export class NavbarItem{
    id: string;
    text: string;
    a_option?: Aoption[];
    template?: TemplateRef<any>;
}

export class Aoption {
    attr_key: string;
    attr_val: string;
}
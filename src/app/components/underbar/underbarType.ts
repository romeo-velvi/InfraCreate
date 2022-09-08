import { TemplateRef } from "@angular/core";

export class UnderbarElement {
    element: UnderbarItem[];
}

export class UnderbarItem {
    id: string;
    type: "separator" | "template" | "button";
    button?: {
        iconClass: string
        tooltipText: string
    } 
    template?: TemplateRef<any>;
}

import { TemplateRef } from "@angular/core";

export class TabnavElement {
    element: TabnavItem[];
}

export class TabnavItem {
    id: string;
    text: string;
    template: TemplateRef<any>
}
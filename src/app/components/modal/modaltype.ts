import { TemplateRef } from "@angular/core";

export class ModalItem {
    title: string;
    text_content?: string;
    template?: TemplateRef<any>;
    buttons: ModalButton[];
    backgroundColor?: string = "ffffff5e";
}

export class ModalButton {
    id: string;
    text: string;
    type: "primary" | "secondary" | "danger" | "success";
}
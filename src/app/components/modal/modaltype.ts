import { TemplateRef } from "@angular/core";

/**
 * Tipo di dato passato alla componente ModalComponent per l'elaborazione.
 *  @see {ModalComponent}
 */
export class ModalItem {
    title: string;
    text_content?: string;
    template?: TemplateRef<any>;
    buttons: ModalButton[];
    backgroundColor?: string = "ffffff5e";
}
/**
 * Elemento che indica il tipo di pulsante nel modal.
 * Esso è usato anche come di ritorno dell'evento "button-clicked".
 * @see {ModalComponent}
 */
export class ModalButton {
    id: string;
    text: string;
    type: "primary" | "secondary" | "danger" | "success";
}
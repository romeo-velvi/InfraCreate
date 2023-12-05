import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataInputElement, DataInputReturned } from 'src/app/components/data-input/dataInputType';
import { ModalItem } from 'src/app/components/modal/modalType';
import { SubjectType, ComposerVisualizerType, DataRouteComposer, DataRouteVisualizer } from 'src/app/models/appType';
import { FileService } from 'src/app/services/application/file/file.service';
import { StorageService } from 'src/app/services/application/storage/storage.service';

/**
 * Componente (pagina) che ha lo scopo di mostrare all'utente una landing tale per cui potrà scegliere di:
 * - Creare un teatro.
 * - Creare un modulo.
 * - Visualizzare un teatro.
 * - Visualizzare un modulo.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {


  // support var

  /**
   * Variabile di supporto che conterrà l'id del modulo/teatro da visualizzare
   * @type {number}
   */
  protected id: number;
  /**
   * Variabile di supporto che conterrà il nome del modulo/teatro da costruire
   * @type {string}
   */
  protected name: string;
  /**
   * Variabile di supporto che conterrà la descrizione del modulo/teatro da costruire
   * @type {string}
   */
  protected description: string;
  /**
   * Variabile di supporto che conterrà l'autore il nome del modulo/teatro da costruire
   * @type {string}
   */
  protected author: string;


  /**
   * Variabile che indica l'elemento del DOM.
   * In particolare contiene le informmazioni del form da visualizzare per la creazione / visualizzazione.
   * @type {TemplateRef}
   */
  @ViewChild('data_input_template') data_input_template?: TemplateRef<any>;



  //support var

  /**
   * Variabile di supporto che indica il composer 
   * @see {ComposerVisualizerType}
   */
  protected COMPOSER = ComposerVisualizerType.COMPOSER;
  /**
   * Variabile di supporto che indica il visualizer 
   * @see {ComposerVisualizerType}
   */
  protected VISUALIZER = ComposerVisualizerType.VISUALIZER;
  /**
    * Variabile di supporto che indica il modulo 
    * @see {SubjectType}
    */
  protected Module = SubjectType.MODULE;
  /**
    * Variabile di supporto che indica il teatro 
    * @see {SubjectType}
    */
  protected Theater = SubjectType.THEATER;



  // state var

  /**
   * Variabile che indica il tipo di operazione selezionata al momento
   * @type {ComposerVisualizerType}
   */
  protected branch: ComposerVisualizerType;
    /**
   * Variabile che indica il tipo di elemento selezionata al momento
   * @type {SubjectType}
   */
  protected type: SubjectType;
  /**
   * Variabile che indica il tipo di form da visualizzare, una volta scelto.
   * @type {DataInputElement} 
   */
  protected formElementModal: DataInputElement;



  // input conf

  /**
   * Variabile che indica i tipi di input che devono esserci nel form al momento dell'inserimento della creazione di un modulo/teatro.
   * @type {DataInputElement}
   */
  protected formElementComposer: DataInputElement = {
    element: [
      {
        id: "author",
        text: "Author",
        type: "text",
        required: true
      },
      {
        id: "name",
        text: "Name",
        type: "text",
        required: true
      },
      {
        id: "description",
        text: "Description",
        type: "textarea",
        required: true
      },
    ]
  };
    /**
   * Variabile che indica i tipi di input che devono esserci nel form al momento dell'inserimento della visualizzazione di un modulo/teatro.
   * @type {DataInputElement}
   */
  protected formElementVisualizer: DataInputElement = {
    element: [
      {
        id: "id",
        text: "Id",
        type: "text",
        required: true,
      },
    ]
  };



  // modal conf

  /**
   * Variabile utilizzata per lo stato show/hide della modal.
   * @type {boolean}
   * @default {false}
   */
  protected isModalActive: boolean = false;
  /**
   * Variabile che contiene l'isieme delle opzioni per la modale.
   */
  protected dataModal: ModalItem;



  // file var

  /**
   * Variabile che contiene i dati del file dato in input.
   */
  protected fileJSON: any = undefined;
  /**
   * Variabile che indica se e quando il file è stato caricato (correttamente).
   * @type {boolean}
   * @default {false}
   */
  protected fileLoaded: boolean = false;



  /**
   * Costruttore componente HomeComponent
   * @param router 
   * @param fileService 
   * @param storageService 
   */
  constructor(private router: Router, private fileService: FileService, private storageService: StorageService) {
  }


  /**
   * Funzione richiamata al momento del click su una scelta.
   * Valorizza il branch (designer/visualize) e tipo (module/theater) scelto.
   * @param branch 
   * @param type 
   * @see {dataModal}
   * @see {branch}
   * @see {type}
   * @see {isModalActive}
   */
  buttonClick(branch: ComposerVisualizerType, type: SubjectType): void {
    this.branch = branch;
    this.type = type;
    let title: string = type + " " + branch;
    if (branch === ComposerVisualizerType.COMPOSER) {
      this.formElementModal = this.formElementComposer
    }
    else {
      this.formElementModal = this.formElementVisualizer
    }
    this.dataModal = {
      title: title,
      template: this.data_input_template,
      buttons: [],
      backgroundColor: "#0000005e",
      //f9fafb24
    };
    this.isModalActive = true;
  }


  /**
   * Funzione richiamata non appena la form è stata validata.
   * - Salva i dati di ritorno nelle opportune variabili.
   * - Esegue le operazioni per il routing degli elementi.
   * @param val 
   * @see {startapplication}
   */
  dataInputReturned(val: DataInputReturned) {
    this.isModalActive = false;
    if (!val || !val.isValid) return;
    if (this.branch === ComposerVisualizerType.VISUALIZER) {
      this.id = val.element["id"].value
    }
    if (this.branch === ComposerVisualizerType.COMPOSER) {
      this.name = val.element['name'].value;
      this.description = val.element['description'].value;
      this.author = val.element['author'].value;
    }
    this.startapplication();
  }



  /**
   * Funzione richiamata non appena i hanno i dati valorizzati. 
   * Si occupa del redirezionamento per il branch scelto con passaggio di variabili nella route.
   * @see {router}
   */
  startapplication() {
    var state: DataRouteComposer | DataRouteVisualizer;
    if (this.branch === ComposerVisualizerType.VISUALIZER) {
      var id = this.id;
      state = {
        id: id as number,
        type: this.type
      };
      this.router.navigateByUrl(
        '/visualizer',
        {
          state
        }
      );
    }
    else if (this.branch === ComposerVisualizerType.COMPOSER) {
      var name = this.name;
      var description = this.description;
      var author = this.author;
      state = {
        name: name as string,
        description: description as string,
        author: author as string,
        type: this.type
      };
      this.router.navigateByUrl(
        '/composer',
        {
          state
        }
      );
    }
  }



  /**
   * Funzione richiamata quando si seleziona il file.
   * Richiama il servizio di gestione dell'upload file e prende il risultato.
   * @param event 
   * @see {fileService}
   * @see {fileJSON}
   */
  async onFileSelected(event: any) {
    await this.fileService.onFileSelected(event,this.type)
      .then((v) => {
        this.fileJSON = v; this.fileLoaded = true;
      })
      .catch((e) => {
        alert(e + "\n Make sure the file is correct and that it ends with \" ."+this.type.toLowerCase() + ".json\"")
      })
  }



  /**
   * Funzione richiamata dopo aver aggiunto il file. 
   * Se corretto, esegue la funzione di route dell'elemento scelto.
   * @see {startapplication}
   */
  onUpload() {
    this.storageService.data = this.fileJSON;
    this.startapplication();
  }

  /**
   * Funzione richiamata quando si esegue un reset dei dati del file dato in input.
   * @param input 
   */
  onReset(input) {
    input.value = ""
    this.fileLoaded = false;
    this.fileJSON = undefined;
  }

}

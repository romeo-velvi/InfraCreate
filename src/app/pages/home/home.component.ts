import { ThrowStmt } from '@angular/compiler';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataInputElement, DataInputReturned } from 'src/app/components/data-input/datainputtype';
import { ModalItem } from 'src/app/components/modal/modaltype';
import { SubjectType, ComposerVisualizerType, DataRouteComposer, DataRouteVisualizer } from 'src/app/models/appType';
import { FileService } from 'src/app/services/application/file/file.service';
import { StorageService } from 'src/app/services/application/storage/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  // var
  id: number;
  name: string;
  description: string;
  author: string;

  // reference
  @ViewChild('data_input_template') data_input_template?: TemplateRef<any>;

  //tipe stat
  COMPOSER = ComposerVisualizerType.COMPOSER;
  VISUALIZER = ComposerVisualizerType.VISUALIZER;
  Module = SubjectType.MODULE;
  Theater = SubjectType.THEATER;

  branch: ComposerVisualizerType;
  type: SubjectType;

  // input conf
  formElementModal: DataInputElement;
  formElementComposer: DataInputElement = {
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
      // {
      //   id:"select",
      //   text:"select",
      //   type:"selection",
      //   selected_number:0,
      //   selection: [
      //     {text:"uno",value:"1"},
      //     {text:"due",value:"2"},
      //     {text:"tre",value:"3"},
      //   ],
      //   required: false
      // },
      // {
      //   id: "check",
      //   text: "check",
      //   type: 'checkbox',
      //   checked: false,
      //   required: false
      // },
    ]
  };
  formElementVisualizer: DataInputElement = {
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
  isModalActive: boolean = false;
  dataModal: ModalItem;

  // file var
  fileJSON: any = undefined;
  fileLoaded: boolean = false;

  constructor(private router: Router, private fileService: FileService, private storageService: StorageService) {
  }

  ngOnInit(): void {
  }

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


  async onFileSelected(event: any) {
    await this.fileService.onFileSelected(event)
      .then((v) => {
        this.fileJSON = v; this.fileLoaded = true;
      })
      .catch((e) => {
        alert(e+"\n Make sure it ends with \" ."+this.type.toLowerCase()+".json \"")
      })
    console.log("->", this.fileJSON);
  }

  onUpload() {
    this.storageService.data = this.fileJSON;
    this.startapplication();
  }

  onReset(input) {
    input.value = ""
    this.fileLoaded = false;
    this.fileJSON = undefined;
  }

}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
// import { ReteComponent } from '../rete/rete.component';
import { KeycloakService } from 'keycloak-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { VisualEditorFetcher } from './visual-editor.fetcher';
import { VisualEditorParser } from './visual-editor.parser';

@Component({
  selector: 'app-visual-editor',
  templateUrl: './visual-editor.component.html',
  styleUrls: ['./visual-editor.component.sass']
})

export class VisualEditorComponent implements OnInit {

  fetcher: any;
  parser: any;

  parsed_modules: any;
  parsed_theater: any;

  isDataAvailable: boolean = false;

  constructor(private keycloakService: KeycloakService, private http: HttpClient, private spinner: NgxSpinnerService) {

    this.fetcher = new VisualEditorFetcher(
      this.keycloakService,
      this.http
    );

    this.parser = new VisualEditorParser();

    document.body.style.overflow = 'hidden'; // per prevenire lo scrolling

  }

  async ngOnInit() {

    await this.spinner.show()
      .then(
        async () => {
          await this.delay(1000);
          // console.log("start 3")
          await this.FetchParseData();
        }
      )
      .then(
        async () => {
          // console.log("start 5")
          await this.spinner.hide();
        }
      )

  }

  async FetchParseData() {

    // TAKE DATA
    await this.fetcher.retrieve_data(502);
    var data_theater = this.fetcher.get_data_theater();
    var data_modules = this.fetcher.get_data_modules();
    console.log("thr component", data_theater);
    console.log("mds component", data_modules);

    await new Promise(resolve => setTimeout(resolve, 1000));

    //PARSING DATA
    await this.parser.parse_data(data_theater, data_modules);
    this.parsed_theater = this.parser.get_parsed_theater();
    this.parsed_modules = this.parser.get_parsed_modules();
    // console.log("thr parsed", this.parsed_theater);
    // console.log("mds parsed", this.parsed_modules);

    this.isDataAvailable = true;
  }


  public delay(ms: number) {
    // console.log("start -> delay");
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}



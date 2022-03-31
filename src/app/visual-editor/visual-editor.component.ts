import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
// import { ReteComponent } from '../rete/rete.component';
import { KeycloakService } from 'keycloak-angular';
import { VisualEditorFetcher } from './visual-editor.fetcher';
import { VisualEditorParser } from './visual-editor.parser';

@Component({
  selector: 'app-visual-editor',
  templateUrl: './visual-editor.component.html',
  styleUrls: ['./visual-editor.component.sass']
})

export class VisualEditorComponent implements OnInit {

  fetcher;
  parser;

  constructor(private keycloakService: KeycloakService, private http: HttpClient) {

    this.fetcher = new VisualEditorFetcher(
      this.keycloakService,
      this.http
    );
    
    this.parser = new VisualEditorParser();

  }

  async ngOnInit() {

    // TAKE DATA
    await this.fetcher.retrieve_data();
    console.log("avanti");

    var data_theater = this.fetcher.get_data_theater();
    var data_modules = this.fetcher.get_data_modules();

    console.log("thr component", data_theater);
    console.log("mds component", data_modules);

    await new Promise(resolve => setTimeout(resolve, 1000));

    //PARSING DATA
    this.parser.parse_data(data_theater,data_modules);

    // var parsed_theater = this.parser.get_parsed_theater();
    // var parsed_modules = this.parser.get_parsed_modules();

    // console.log("parsed thr:", parsed_theater);
    // console.log("parsed mds:", parsed_modules);

  }

}



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
  data_theater;
  data_modules;

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

    this.data_theater = this.fetcher.get_data_theater();
    this.data_modules = this.fetcher.get_data_modules();

    console.log("thr:", this.data_theater);
    console.log("mds:", this.data_modules);

    //PARSING DATA
    

  }

}



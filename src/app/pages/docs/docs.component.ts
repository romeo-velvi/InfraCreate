import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.sass']
})
export class DocsComponent implements OnInit {

  compodoc_index_html: any;
  IFRAMEvisibility: string = 'none';

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    const headers = new HttpHeaders().set('Content-Type', 'text/html');
    this.http.get('assets/documentation/index.html', {headers, responseType: 'text'})
    .subscribe(data => {
      this.compodoc_index_html = this.sanitizer.bypassSecurityTrustHtml(data as string);
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.sass']
})
export class DocsComponent implements OnInit {

  compodoc_index_html: any;

  constructor(
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    fetch('/../documentation/index.html')
    .then(res => res.text())
    .then(data => {
      this.compodoc_index_html = this.sanitizer.bypassSecurityTrustHtml(data);
    })
  }

}

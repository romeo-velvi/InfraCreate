import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

/**
 * Componente (pagina) che ha lo scopo di mostrare la documentazione stilizzata con compodoc.
 * - Servita come html in un <iframe>.
 */
@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.sass']
})
export class DocsComponent implements OnInit {

  /**
   * Variabile che indica l'html (sanitized) reperito dalla documentazione.
   * @see {DomSanitizer}
   */
  protected compodoc_index_html: any;
  /**
   * Variabile che indica la visibilit o meno dell'<iframe> rispettivamente: "none" "block".
   * @type {string} -> "none" | "visible".
  */
  protected IFRAMEvisibility: string = 'none';

  /**
   * Costruttore componete DocsComponent
   * @param sanitizer 
   * @param http 
   */
  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  /**
   * Funzione richiamata all'inizializzazione della componente.
   * Prevede di eseguire la chiamata per reperire l'html della documentazione.
   * @see {compodoc_index_html}
   */
  ngOnInit(): void {
    const headers = new HttpHeaders().set('Content-Type', 'text/html');
    this.http.get('assets/documentation/index.html', {headers, responseType: 'text'})
    .subscribe(data => {
      this.compodoc_index_html = this.sanitizer.bypassSecurityTrustHtml(data as string);
    })
  }

}

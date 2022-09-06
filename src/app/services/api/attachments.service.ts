import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenService } from '../token/token.service';
import { TheaterService } from './theater.service';
import { stringify as YAMLstringfy } from "json-to-pretty-yaml"

@Injectable({
  providedIn: 'root'
})
export class AttachmentsService {

  constructor(private http: HttpClient, private tokenService: TokenService, private theaterService: TheaterService) { }

  async getModuleAttachment(module_id: string | number, attachments_uuid: string | number) {
    let link: string = environment.getModuleAttachment(module_id, attachments_uuid);
    let x = this.http.get(link, { responseType: 'arraybuffer' });
    x.subscribe(
      data => {
        const blob = new Blob([data], {
          type: 'application/zip'
        });
        const url = window.URL.createObjectURL(blob);
        // window.open(url);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.classList.add('d-none');
        a.href = url;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    )
    return x;
  }

  async getTheaterAttachment(theater_id: string|number){
    let link: string = environment.getTheaterAttachment(theater_id);
    let x = this.http.get(link, { responseType: 'arraybuffer' });
    x.subscribe(
      data => {
        const blob = new Blob([data], {
          type: 'application/zip'
        });
        const url = window.URL.createObjectURL(blob);
        // window.open(url);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.classList.add('d-none');
        a.href = url;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    )
    return x;
  }

}

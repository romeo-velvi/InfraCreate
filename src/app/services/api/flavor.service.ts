import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FlavorDTO } from '../modelsDTO/falvorDTO';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class FlavorService {

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  async getAllFlavor(): Promise<FlavorDTO[]> {

    let link: string = environment.getAllFlavor;

    const promise = await new Promise<FlavorDTO[]>((resolve, reject) => {
      this.http.get
        (
          link,
          this.tokenService.getHttpgetOption()
        )
        .toPromise()
        .then(
          (res: FlavorDTO[]) => {
            resolve(res);
          }
        )
        .catch(
          error => {
            reject(error);
          }
        );
    }
    );
    return promise;
  }
  
  async getFlavorByID(id: number|string): Promise<FlavorDTO> {

    let link: string = environment.getAllFlavor+'/'+id;

    const promise = await new Promise<FlavorDTO>((resolve, reject) => {
      this.http.get
        (
          link,
          this.tokenService.getHttpgetOption()
        )
        .toPromise()
        .then(
          (res: FlavorDTO) => {
            resolve(res);
          }
        )
        .catch(
          error => {
            reject(error);
          }
        );
    }
    );
    return promise;
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SimpleModuleDTO } from '../modelsDTO/moduleDTO';
import { TheaterDTO } from '../modelsDTO/theaterDTO';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class TheaterService {

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  async getTheaterInfoByID(theater_id: number | string): Promise<TheaterDTO> {

    let link: string = environment.getTheaterByID + (theater_id as unknown as string);

    const promise = await new Promise<TheaterDTO>(
      (resolve, reject) => {
        this.http.get
          (
            link,
            this.tokenService.getHttpgetOption()
          )
          .toPromise()
          .then(
            (res: TheaterDTO) => {
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

  async getTheaterModulesByUUID(theater_uuid: number | string): Promise<SimpleModuleDTO[]> {

    let link: string = environment.getTheaterModulesByUUID + (theater_uuid as unknown as string);

    const promise = await new Promise<SimpleModuleDTO[]>((resolve, reject) => {
      this.http.get
        (
          link,
          this.tokenService.getHttpgetOption()
        )
        .toPromise()
        .then(
          (res: SimpleModuleDTO[]) => {
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

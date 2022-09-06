import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HostModuleDTO } from '../modelsDTO/hostDTO';
import { ModuleDTO, ModuleListDTO, ModuleNetworkInterfaceDTO, SimpleModuleDTO } from '../modelsDTO/moduleDTO';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  async getModuleByID(id: string | number): Promise<ModuleDTO> {

    let link: string = environment.getAllModules + "/" + id;

    const promise = await new Promise<ModuleDTO>((resolve, reject) => {
      this.http.get
        (
          link,
          this.tokenService.getHttpgetOption()
        )
        .toPromise()
        .then(
          (res: ModuleDTO) => {
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

  async getAllModules(): Promise<SimpleModuleDTO[]> {
    let x: SimpleModuleDTO[] = [];
    let currentpage = 0, endpage = 1; // at least 1 page 
    while (currentpage < endpage) {
      let y: ModuleListDTO = await this.getAllModulesPage(currentpage);
      x = [
        ...x,
        ...y.content
      ]
      endpage = y.totalPages as number;
      currentpage = currentpage + 1;
    }
    return x;
  }

  async getModuleHostByTheaterUUID(theater_uuid: number | string): Promise<HostModuleDTO[]> {

    let link: string = environment.getModulesHostsByTheaterUUID + (theater_uuid as unknown as string) + environment.GMHhost;

    const promise = await new Promise<HostModuleDTO[]>((resolve, reject) => {
      this.http.get
        (
          link,
          this.tokenService.getHttpgetOption()
        )
        .toPromise()
        .then(
          (res: HostModuleDTO[]) => {
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

  async getModuleInterfacesByModuleID(module_id: number | string): Promise<ModuleNetworkInterfaceDTO[]> {

    let link: string = environment.getModuleInterfacesByModuleID + (module_id as unknown as string);

    const promise = await new Promise<ModuleNetworkInterfaceDTO[]>((resolve, reject) => {
      this.http.get
        (
          link,
          this.tokenService.getHttpgetOption()
        )
        .toPromise()
        .then(
          (res: ModuleNetworkInterfaceDTO[]) => {
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

  async getAllModulesPage(pageindex: number): Promise<ModuleListDTO> {

    let link: string = environment.getAllModules + '?page=' + (pageindex ? pageindex : 0);

    const promise = await new Promise<ModuleListDTO>((resolve, reject) => {
      this.http.get
        (
          link,
          this.tokenService.getHttpgetOption()
        )
        .toPromise()
        .then(
          (res: ModuleListDTO) => {
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

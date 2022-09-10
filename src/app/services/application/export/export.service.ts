import { Injectable } from '@angular/core';
import { Data } from 'rete/types/core/data';
import { ModuleApplication, TheaterApplication } from '../../modelsApplication/applicationModels';
import { ModuleExport } from '../../modelsExport/moduleExport';
import { ExportModule } from './exportModule';
import { ExportTheater } from './exportTheater';
import { stringify as YAMLstringfy } from "json-to-pretty-yaml"
import { TheaterExport } from '../../modelsExport/theaterExport';
import { SubjectType } from 'src/app/models/appType';

/**
 * Servizio di eport del canvas/editor sottoforma di file (scaricabile)
 * - Prevede l'export del teatro e modulo sottoforma di JSON (da poter utilizzare nell'applicazione).
 * - Prevede l'export del teatro e modulo sottoforma di YAML (standard tosca).
 */
@Injectable({
  providedIn: 'root'
})
export class ExportService {

  /**
   * Variabile che indica l'estensione aggiuntiva al nome e tipo del file
   * @example 
   * Se si dovesse scaricare l'application (json) di un teatro, essa sarebbe: nomeTeatro.theater.json 
   */
  protected theaterType="."+SubjectType.THEATER.toLowerCase();
    /**
   * Variabile che indica l'estensione aggiuntiva al nome e tipo del file
   * @example 
   * Se si dovesse scaricare l'application (json) di un modulo, essa sarebbe: nomeMosulo.module.json 
   */
  protected moduleType="."+SubjectType.MODULE.toLowerCase();

  constructor() { }

  /**
   * Funzione che esegue l'export di un modulo nel formato YAML standrard tosca.
   * @param module 
   * @param editor 
   * @see {ExportModule}
   * @see {exportToYaml}
   */
  exportModuleToYAML(module: ModuleApplication, editor: Data) {
    let data: ModuleExport = new ExportModule(module, editor).convertModule();
    return this.exportToYaml(module.name, data);
  }

  /**
   * Funzione che esegue l'export di un modulo nel formato JSON (application).
   * @param module 
   * @param editor 
   * @see {exportToJson} 
   */
  exportModuleToJSON(module: ModuleApplication, editor: Data) {
    return this.exportToJson(module.name+this.moduleType, module);
  }


  /**
   * Funzione che esegue l'export di un teatro nel formato YAML standrard tosca.
   * @param module 
   * @param editor 
   * @see {exportTheater}
   * @see {exportToYaml}
   */
  exportTheaterToYAML(theater: TheaterApplication, editor: Data) {
    let data: TheaterExport = new ExportTheater(theater, editor).convertTheater();
    return this.exportToYaml(theater.name, data);
  }

  /**
   * Funzione che esegue l'export di un teatro nel formato JSON (application).
   * @param module 
   * @param editor 
   * @see {exportToJson} 
   */
  exportTheaterToJSON(theater: TheaterApplication, editor: Data) {
    return this.exportToJson(theater.name+this.theaterType, theater);
  }

  /**
   * Funzione che si occupa del download effettivo in un formato yaml.
   * @param fn 
   * @param objectData 
   */
  exportToYaml(fn: string, objectData: any) {
    const data = YAMLstringfy(objectData);
    let filename = fn + ".yaml";
    let contentType = "application/json;charset=utf-8;";
    var blob = new Blob([decodeURIComponent(encodeURI(data))], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.classList.add('d-none');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  /**
   * Funzione che si occupa del download effettivo in un formato json.
   * @param fn 
   * @param objectData 
   */
  exportToJson(fn: string, objectData: any) {
    const data = JSON.stringify(objectData);
    let filename = fn + ".json";
    let contentType = "application/json;charset=utf-8;";
    var blob = new Blob([decodeURIComponent(encodeURI(data))], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.classList.add('d-none');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }



}

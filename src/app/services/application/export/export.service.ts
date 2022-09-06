import { Injectable } from '@angular/core';
import { Data } from 'rete/types/core/data';
import { ModuleApplication, TheaterApplication } from '../../modelsApplication/applicationModels';
import { ModuleExport } from '../../modelsExport/moduleExport';
import { ExportModule } from './exportModule';
import { ExportTheater } from './exportTheater';
import { stringify as YAMLstringfy } from "json-to-pretty-yaml"
import { TheaterExport } from '../../modelsExport/theaterExport';


@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  exportModuleToYAML(module: ModuleApplication, editor: Data) {
    let data: ModuleExport = new ExportModule(module, editor).convertModule();
    return this.exportToYaml(module.name, data);
  }
  exportModuleToJSON(module: ModuleApplication, editor: Data) {
    return this.exportToJson(module.name, module);
  }

  exportTheaterToYAML(theater: TheaterApplication, editor: Data) {
    let data: TheaterExport = new ExportTheater(theater, editor).convertTheater();
    return this.exportToYaml(theater.name, data);
  }
  exportTheaterToJSON(theater: TheaterApplication, editor: Data) {
    return this.exportToJson(theater.name, theater);
  }

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

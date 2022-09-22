import { Injectable } from '@angular/core';
import { SubjectType } from 'src/app/models/appType';
import { ModuleApplication, TheaterApplication } from '../../modelsApplication/applicationModels';

/**
 * Servizio di gestione di importing file da locale all'app.
 */
@Injectable({
  providedIn: 'root'
})
export class FileService {

  /**
 * Variabile che indica l'estensione aggiuntiva al nome e tipo del file
 * @example 
 * Se si dovesse scaricare l'application (json) di un teatro, essa sarebbe: nomeTeatro.theater.json 
 */
  protected theaterType = "." + SubjectType.THEATER.toLowerCase() + ".json";
  /**
 * Variabile che indica l'estensione aggiuntiva al nome e tipo del file
 * @example 
 * Se si dovesse scaricare l'application (json) di un modulo, essa sarebbe: nomeMosulo.module.json 
 */
  protected moduleType = "." + SubjectType.MODULE.toLowerCase() + ".json";


  /**
   * Variabile che ha come scopo il salvataggio di informazioni del file.
   * @type {File}
   */
  protected selectedFile: File;

  constructor() { }

  /**
   * Funzione che viene richiamata per gestire l'evento dell'input una volta captato il file.
   * Si occupa anche di parserizzare il file sottoforma di oggetto (json).
   * @param event 
   * @return {Promise}
   */
  async onFileSelected(event: any, filefor:SubjectType): Promise<any> {
    this.selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(this.selectedFile, "UTF-8");
    return new Promise((resolve, reject) => {
      fileReader.onload = async () => {
        try {
          var data = JSON.parse(fileReader.result as string)
          if (this.isFileValid(this.selectedFile, data, filefor))
            resolve(data)
          else
            reject("The file selected is not valid")
        }
        catch (e) {
          reject(e);
        }
      }
      fileReader.onerror = (error) => {
        reject("Unable to read file.");
      }
    }
    )
  }

  /**
   * Funzione cha come scopo ritornare il file (sottoforma di oggetto parserizzato) captato dall'input.
   * @returns 
   */
  getFile(): File {
    return this.selectedFile;
  }

  /**
   * Funzione che ha lo scopo di controllare se il file è accettabile dall'applicazione o meno.
   * @param file 
   * @param data 
   * @returns {boolean}
   */
  isFileValid(file: File, data: any, filefor: SubjectType): boolean {
    if (file.type !== "application/json")
      return false
    if (file.name.includes(this.theaterType) && filefor === SubjectType.THEATER) {
      if ((data as TheaterApplication).validateObject === "theater")
        return true
      else
        return false
    }
    else if (file.name.includes(this.moduleType)  && filefor === SubjectType.MODULE) {
      if ((data as ModuleApplication).validateObject === "module")
        return true
      else
        return false
    }
    else
      return false
  }


}

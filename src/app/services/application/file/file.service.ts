import { Injectable } from '@angular/core';

/**
 * Servizio di gestione di importing file da locale all'app.
 */
@Injectable({
  providedIn: 'root'
})
export class FileService {

  /**
   * Variabile che ha come scopo il salvataggio di informazioni del file.
   * @type {File}
   */
  private selectedFile: File;

  constructor() { }

  /**
   * Funzione che viene richiamata per gestire l'evento dell'input una volta captato il file.
   * Si occupa anche di parserizzare il file sottoforma di oggetto (json).
   * @param event 
   * @return {Promise}
   */
  async onFileSelected(event: any): Promise<any> {
    this.selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(this.selectedFile, "UTF-8");
    return new Promise((resolve, reject) => {
      fileReader.onload = async () => {
        try {
          if(this.selectedFile.type!=="application/json")
            reject("The file selected is not supproted.")
          resolve(JSON.parse(fileReader.result as string));
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
  getFile(): File{
    return this.selectedFile;
  }

}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private selectedFile: File;

  constructor() { }

  async onFileSelected(event: any) {
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

  getFile(): File{
    return this.selectedFile;
  }

}

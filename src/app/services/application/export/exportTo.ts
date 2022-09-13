import { stringify as YAMLstringfy } from "json-to-pretty-yaml"


 /**
   * Funzione che si occupa del download effettivo in un formato yaml.
   * @param fn 
   * @param objectData 
   */
  export function exportToYaml(fn: string, objectData: any) {
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
   export function exportToJson(fn: string, objectData: any) {
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


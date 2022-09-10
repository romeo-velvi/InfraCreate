// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

var link = "http://10.20.30.210:8000";
var sublink = "/library-asset/api/v1/rest";
var basepath = link + sublink;

export const environment = {
  production: false,
  mocked: true,
  getTheaterByID: basepath + "/theatres/",
  getTheaterModulesByUUID: basepath + "/modules/theatre_uuid/",
  getModulesHostsByTheaterUUID: basepath + "/moduleVms/module/",
  GMHhost: "/host",
  getModuleInterfacesByModuleID: basepath + "/moduleNetworkInterfaces/module/",
  getAllModules: basepath + "/modules",
  getAllFlavor: basepath + '/vhModels',
  getModuleAttachment: (module_id: string | number, attachments_uuid: string | number): string => { return basepath + "/modules/" + module_id + "/attachments/" + attachments_uuid + "/download/resource" },
  getTheaterAttachment: (theater_id: string | number): string => { return basepath + "/theatres/" + theater_id + "/attachments/download/resource" }
};

import { Injectable } from '@angular/core';
import { TheaterService } from '../../api/theater.service';
import { ModuleService } from '../../api/module.service';
import {  ModuleInstance, TheaterApplication, ModuleApplication, FlavorApplication } from '../../modelsApplication/applicationModels';
import { FlavorService } from '../../api/flavor.service';
import { ParseDataForTheaterVisualizer } from './parseDataForTheaterVisualizer';
import { PerseDataForTheaterComposer } from './perseDataForTheaterComposer';
import { PerseDataForModuleVisualizer } from './perseDataForModuleVisualizer';
import { PerseDataForModuleComposer } from './perseDataForModuleComposer';
import { MockedTheater } from '../../mock/dataset-theaterVisualizer/TVdata';
import { MockedModule } from '../../mock/dataset-moduleVisualizer/MVdata';
import { MockedAllFlavors } from '../../mock/dataset-moduleDesigner/MDdata';
import { MockedAllModules } from '../../mock/dataset-theaterDesigner/TDdata';
import { environment } from 'src/environments/environment';

/**
 * Servizio che ha lo scopo di captare i dati provenienti o meno dal server e convertirli in un formato comprensibile all'applacazione e al canvas.
 */
@Injectable({
  providedIn: 'root'
})
export class ParseService {

  /**
   * Variabile che contiene l'opzione di mock dei dati.
   */
  mocked?=environment.mocked;








  
  /**
   * Costrutture servizio parsing.
   * @param theaterService 
   * @param moduleService 
   * @param flavorService 
   */
  constructor(
    private theaterService: TheaterService,
    private moduleService: ModuleService,
    private flavorService: FlavorService
  ) {
  }





  // parsing type

  /**
   * Funzione che si occupa del parsing del teatro per la visualizzazione.
   * @param id 
   * @returns {Promise<TheaterApplication>}
   * @see {ParseDataForTheaterVisualizer}
   * @see {MockedTheater}
   */
  async parseTheaterForTheaterVisualizer(id: string | number): Promise<TheaterApplication> {
    if (this.mocked)
      return (await MockedTheater(id) as unknown as TheaterApplication)
    else
      return await new ParseDataForTheaterVisualizer(this.theaterService, this.moduleService).parseTheaterForTheaterVisualizer(id);
  }




  /**
   * Funzione che si occupa del parsing dei moduli per la composizione del teatro.
   * @returns { Promise<{ [name: string]: ModuleInstance }> }
   * @see {PerseDataForTheaterComposer}
   * @see {MockedAllModules}
   */
  async parseModuleForTheaterComposer(): Promise<{ [name: string]: ModuleInstance }> {
    if (this.mocked)
      return await MockedAllModules() as unknown as { [name: string]: ModuleInstance }
    else
      return await new PerseDataForTheaterComposer(this.moduleService).parseModuleForTheaterComposer();
  }




  /**
   * Funzione che si occupa del parsing del modulo per la visualizzazione
   * @param id 
   * @returns {Promise<ModuleApplication>}
   * @see {PerseDataForModuleVisualizer}
   * @see {MockedModule}
   */
  async parseModuleForModuleVisualizer(id: string | number): Promise<ModuleApplication> {
    if (this.mocked)
      return (await MockedModule(id) as unknown as ModuleApplication)
    else
      return await new PerseDataForModuleVisualizer(this.moduleService).parseModuleForModuleVisualizer(id);
  }





  /**
   * Funzione che si occupa del parsing dei flavor per la costruzione dei moduli
   * @returns {Promise<FlavorApplication[]>}
   * @see {PerseDataForModuleComposer}
   * @see {MockedAllFlavors}
   */
  async parseFlavorForModuleComposer(): Promise<FlavorApplication[]> {
    if (this.mocked)
      return await MockedAllFlavors() as unknown as FlavorApplication[]
    else
      return await new PerseDataForModuleComposer(this.flavorService).parseFlavorForModuleComposer();
  }

}
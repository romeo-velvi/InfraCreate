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

@Injectable({
  providedIn: 'root'
})
export class ParseService {

  mocked?=environment.mocked;

  constructor(
    private theaterService: TheaterService,
    private moduleService: ModuleService,
    private flavorService: FlavorService
  ) {
  }

  // parsing type
  async parseTheaterForTheaterVisualizer(id: string | number): Promise<TheaterApplication> {
    if (this.mocked)
      return (await MockedTheater(id) as unknown as TheaterApplication)
    else
      return await new ParseDataForTheaterVisualizer(this.theaterService, this.moduleService).parseTheaterForTheaterVisualizer(id);
  }
  async parseModuleForTheaterComposer(): Promise<{ [name: string]: ModuleInstance }> {
    if (this.mocked)
      return await MockedAllModules() as unknown as { [name: string]: ModuleInstance }
    else
      return await new PerseDataForTheaterComposer(this.moduleService).parseModuleForTheaterComposer();
  }
  async parseModuleForModuleVisualizer(id: string | number): Promise<ModuleApplication> {
    if (this.mocked)
      return (await MockedModule(id) as unknown as ModuleApplication)
    else
      return await new PerseDataForModuleVisualizer(this.moduleService).parseModuleForModuleVisualizer(id);
  }
  async parseFlavorForModuleComposer(): Promise<FlavorApplication[]> {
    if (this.mocked)
      return await MockedAllFlavors() as unknown as FlavorApplication[]
    else
      return await new PerseDataForModuleComposer(this.flavorService).parseFlavorForModuleComposer();
  }

}
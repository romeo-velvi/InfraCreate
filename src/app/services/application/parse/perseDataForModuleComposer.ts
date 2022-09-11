import { FlavorService } from '../../api/flavor.service';
import { FlavorApplication } from '../../modelsApplication/applicationModels';
import { FlavorDTO } from '../../modelsDTO/falvorDTO';



export class PerseDataForModuleComposer {




    
    constructor(private flavorService: FlavorService) {
    }




    async parseFlavorForModuleComposer(): Promise<FlavorApplication[]> {
        let flavorDTO: FlavorDTO[] = await this.flavorService.getAllFlavor();
        let flavorApplication: FlavorApplication[] = this.parseFlavor(flavorDTO);
        return flavorApplication;
    }





    parseFlavor(flavorDTO: FlavorDTO[]): FlavorApplication[] {
        let fa: FlavorApplication[] = []
        flavorDTO.forEach(f => {
            fa.push({
                flavorName: f.name,
                cpu: f.cpu,
                ram: f.ram,
                disk: f.disk,
            })
        })
        return fa;
    }

}
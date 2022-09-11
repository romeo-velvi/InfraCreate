import { FlavorService } from '../../api/flavor.service';
import { FlavorApplication } from '../../modelsApplication/applicationModels';
import { FlavorDTO } from '../../modelsDTO/falvorDTO';


/**
 * Elemento che ha lo scopo di eseguire il fetching ed il parsing dei dati per la costruzione del modulo.
 */
export class PerseDataForModuleComposer {


    /**
     * Costrutture della componente-
     * @param flavorService 
     */
    constructor(private flavorService: FlavorService) {
    }



    /**
     * Funzione che esegue il fetching ed il parsing dei dati flavor.
     * @returns {Promise<FlavorApplication[]>}
     * @see {flavorService}
     * @see {parseFlavor}
     */
    async parseFlavorForModuleComposer(): Promise<FlavorApplication[]> {
        let flavorDTO: FlavorDTO[] = await this.flavorService.getAllFlavor();
        let flavorApplication: FlavorApplication[] = this.parseFlavor(flavorDTO);
        return flavorApplication;
    }




    /**
     * Funzione che si occupa di eseguire il parsing dei flavor.
     * @param flavorDTO
     * @returns { FlavorApplication[] }
     */
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
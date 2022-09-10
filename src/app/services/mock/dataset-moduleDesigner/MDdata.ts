import { FlavorApplication } from "../../modelsApplication/applicationModels";


/**
 * Entità che possiede i valori dei Flavor utilizzati dal ModuleComposer.
 * Questi possono essere reperibili via API -> in questo caso sono mockati in locale
 */
export const AllFlavors: FlavorApplication[] = [
    {
        "flavorName": "ldo_small",
        "cpu": 1,
        "ram": 2048,
        "disk": 20
    },
    {
        "flavorName": "1cpu-1Gram-10Gdisk",
        "cpu": 1,
        "ram": 1024,
        "disk": 10
    },
    {
        "flavorName": "2cpu-4Gram-40Gdisk",
        "cpu": 2,
        "ram": 4096,
        "disk": 40
    },
    {
        "flavorName": "2cpu-2Gram-20Gdisk",
        "cpu": 2,
        "ram": 2048,
        "disk": 20
    },
    {
        "flavorName": "12cpu-8Gram-500Gdisk",
        "cpu": 12,
        "ram": 8000,
        "disk": 500
    },
    {
        "flavorName": "m1.small",
        "cpu": 1,
        "ram": 2048,
        "disk": 20
    },
    {
        "flavorName": "1cpu-256Mram-5Gdisk",
        "cpu": 1,
        "ram": 256,
        "disk": 5
    },
    {
        "flavorName": "1cpu-512Mram-5Gdisk",
        "cpu": 1,
        "ram": 512,
        "disk": 5
    },
    {
        "flavorName": "1cpu-8Gram-10Gdisk",
        "cpu": 1,
        "ram": 8192,
        "disk": 10
    },
    {
        "flavorName": "4cpu-8Gram-40Gdisk",
        "cpu": 4,
        "ram": 8192,
        "disk": 40
    },
    {
        "flavorName": "4cpu-8Gram-80Gdisk",
        "cpu": 4,
        "ram": 8192,
        "disk": 80
    },
    {
        "flavorName": "1cpu-512Mram-10Gdisk",
        "cpu": 1,
        "ram": 512,
        "disk": 10
    },
    {
        "flavorName": "1cpu-2Gram-10Gdisk",
        "cpu": 1,
        "ram": 2048,
        "disk": 10
    },
    {
        "flavorName": "2cpu-2Gram-40Gdisk",
        "cpu": 2,
        "ram": 2048,
        "disk": 40
    }
]

/**
 * Funzione che ritorna i flavor memorizzati (in locale)
 * @returns {FlavorApplication[]}
 * @see {AllFlavors}
 */
export const MockedAllFlavors = async ()=>{
    await delay();
    return AllFlavors;
}


let delay = async () => {
    return new Promise(resolve => setTimeout(resolve,1000));
}
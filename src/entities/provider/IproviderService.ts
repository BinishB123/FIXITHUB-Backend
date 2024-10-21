import { providingGeneralServiceData, ProvidingRoadServices } from "../../entities/rules/provider"
import { servicetype } from "../../entities/rules/admin"
interface IproviderServiceInteractor {
    getProviderServices(id: string,vechiletype:number): Promise<{
        success: boolean;
        message: string;
        providerGeneralServiceData?: providingGeneralServiceData[];
        providerRoadServiceData?: ProvidingRoadServices[]
        
        // Array of providerRoadServices
    }>
    addGeneralOrRoadService(data: { providerid: string, typeid: string, category: string , vechileType:string }): Promise<{ success: boolean, message: string }>
    addSubTypes(providerid: string, serviceid: string, newSubType: { type: string, startingprice: number,vechileType:string }): Promise<{ success: boolean, message: string }>
    editSubType(providerid:string,serviceid:string,subtype:{type:string,startingprice:number,vechileType:string}):Promise<{success:boolean,message:string}>
    deleteSubtype(providerid:string,serviceid:string,subtype:{type:string},vechileType:string):Promise<{success:boolean,message:string}>
    getallBrands(id:string):Promise<{succes:boolean,message:string,brands?:{_id:string,brand:string,isAdded:boolean}[]}>
    addBrands(data: { id: string; brandid: string; }): Promise<{ success: boolean; message: string; }> 
    deleteBrands(data: { id: string; brandid: string; }): Promise<{ success: boolean; message: string; }> 


    



}

export default IproviderServiceInteractor
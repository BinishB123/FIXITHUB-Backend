import {
    RegisterResponse,
    ProviderRegisterData,
    SigIn,
    SignResponse,
} from "../../entities/rules/provider";
import { ProvidingServices } from "../../entities/provider/IService";
import { servicetype } from "../../entities/rules/admin";
import { promises } from "dns";

interface IProviderRepository {
    sendOtp(otp: string, email: string): Promise<{ created: boolean }>;
    providerExist(email: string): Promise<boolean | null>;
    verifyOtp(otp: string, email: string): Promise<boolean | null>;
    registerProvider(
        registerdata: ProviderRegisterData
    ): Promise<{
        created: boolean;
        message: string;
        provider?: RegisterResponse;
    }>;
    signInProvider(
        providerSignData: SigIn
    ): Promise<{ success: boolean; message: string; provider?: SignResponse }>;
    getProviderServices(
        id: string,
        vechileType: number
    ): Promise<{
        success: boolean;
        message: string;
        providerService?: ProvidingServices;
        allServices?: servicetype[];
    }>;
    addGeneralOrRoadService(data: {
        providerid: string;
        typeid: string;
        category: string;
        vechileType: string;
    }): Promise<{ success: boolean; message: string }>;
    addSubTypes(
        providerid: string,
        serviceid: string,
        newSubType: { type: string; startingprice: number; vechileType: string }
    ): Promise<{ success: boolean; message: string }>;
    editSubType(
        providerid: string,
        serviceid: string,
        subtype: { type: string; startingprice: number; vechileType: string }
    ): Promise<{ success: boolean; message: string }>;
    deleteSubtype(
        providerid: string,
        serviceid: string,
        subtype: { type: string },
        vechileType: string
    ): Promise<{ success: boolean; message: string }>;
    
    getallBrands(id:string):Promise<{succes:boolean,message:string,brands?:{_id:string,brand:string}[],supportedBrands?:{brand:string}[]|[]}>
    addBrands(data:{id:string,brandid:string}):Promise<{success:boolean,message:string}>
    deleteBrand(data:{id:string,brandid:string}):Promise<{success:boolean,message:string}>
}

export default IProviderRepository;

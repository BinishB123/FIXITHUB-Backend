import {
    RegisterResponse,
    ProviderRegisterData,
    SigIn,
    SignResponse,
    IproviderReponseData
} from "../../entities/rules/provider";
import { ProvidingServices } from "../../entities/provider/IService";
import { servicetype } from "../../entities/rules/admin";

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
        vehicleType: number
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
        vehicleType: string;
    }): Promise<{ success: boolean; message: string }>;
    addSubTypes(
        providerid: string,
        serviceid: string,
        newSubType: { type: string; startingprice: number; vehicleType: string }
    ): Promise<{ success: boolean; message: string }>;
    editSubType(
        providerid: string,
        serviceid: string,
        subtype: { type: string; startingprice: number; vehicleType: string }
    ): Promise<{ success: boolean; message: string }>;
    deleteSubtype(
        providerid: string,
        serviceid: string,
        subtype: { type: string },
        vehicleType: string
    ): Promise<{ success: boolean; message: string }>;
    
    getallBrands(id:string):Promise<{succes:boolean,message:string,brands?:{_id:string,brand:string}[],supportedBrands?:{brand:string}[]|[]}>
    addBrands(data:{id:string,brandid:string}):Promise<{success:boolean,message:string}>
    deleteBrand(data:{id:string,brandid:string}):Promise<{success:boolean,message:string}>
    getDataToProfile(id:string):Promise<{success:boolean,message?:string,providerData?:IproviderReponseData|null}>
    editabout(data:{id:string,about:string}):Promise<{success:boolean,message?:string,}>
    addImage(data:{id:string,url:string}):Promise<{success:boolean,message:string,url?:string}>
    updateProfiledatas(data:{id:string,whichisTotChange:string,newOne:string}):Promise<{success:boolean,message?:string}>
    getAllBrand(id:string):Promise<{success:boolean,message?:string,brandData?:{_id:string,brand:string}[]|null}>
    changepassword(data:{id:string,currentpassowrd:string,newpassowrd:string}):Promise<{success?:boolean,message?:string}>
    updateLogo(url:string,id:string):Promise<{success?:boolean,message?:string,url?:string}>

}

export default IProviderRepository;

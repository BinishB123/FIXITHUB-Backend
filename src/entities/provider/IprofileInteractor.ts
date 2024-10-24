import { IproviderReponseData } from "../../entities/rules/provider"





interface IProfileInteractor {
    getDataToProfile(id:string):Promise<{success:boolean,message?:string,providerData?:IproviderReponseData|null}>
    editabout(data:{id:string,about:string}):Promise<{success:boolean,message?:string,}>
    addImage(data:{id:string,url:string}):Promise<{success:boolean,message:string,url?:string}>
    updateProfiledatas(data:{id:string,whichisTotChange:string,newOne:string}):Promise<{success:boolean,message?:string}>



}


export default IProfileInteractor
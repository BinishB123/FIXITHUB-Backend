import { IproviderReponseData } from "../../entities/rules/provider"





interface IProfileInteractor {
    getDataToProfile(id:string):Promise<{success:boolean,message?:string,providerData?:IproviderReponseData|null}>
    editabout(data:{id:string,about:string}):Promise<{success:boolean,message?:string,}>
    addImage(data:{id:string,url:string}):Promise<{success:boolean,message:string,url?:string}>
    updateProfiledatas(data:{id:string,whichisTotChange:string,newOne:string}):Promise<{success:boolean,message?:string}>
    getAllBrand(id:string):Promise<{success:boolean,message?:string,brandData?:{_id:string,brand:string}[]|null}>
    changepassword(data:{id:string,currentpassowrd:string,newpassowrd:string}):Promise<{success?:boolean,message?:string}>
    updateLogo(url:string,id:string):Promise<{success?:boolean,message?:string,url?:string}>
    notificationCountUpdater(id:string):Promise<{count:number}>

}


export default IProfileInteractor
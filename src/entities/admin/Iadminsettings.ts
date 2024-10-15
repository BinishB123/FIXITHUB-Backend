

export default interface IadminSettingInteractor{
    adminAddvechileType(type:number):Promise<{success:boolean,message?:string}>
    adminAddBrand(brand:string):Promise<{success:boolean,message?:string}>
    admingetAllSettingsDatas():Promise<{success:boolean,brands?:string[],generalServices?:any[],roadAssistance?:any[]}>
    addGeneralserviceOrRoadAssistance(data:{ category: "general" | "road",servicetype: string,image:Buffer|undefined}):Promise<{success:boolean,message?:string,created?:Object}>
    addSubType(data:{id:string,type:string}):Promise<{success:boolean,message?:string}>
    deleteSubType(data:{id:string,type:string}):Promise<{success:boolean,message?:string}>


}
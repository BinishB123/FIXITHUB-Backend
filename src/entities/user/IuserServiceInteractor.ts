import { IgetservicesResponse } from "./IuserResponse";


interface IuserServiceInteractor{
    getServices(category:string):Promise<{success:boolean,message:string,services?:IgetservicesResponse[]}>

}

export default IuserServiceInteractor
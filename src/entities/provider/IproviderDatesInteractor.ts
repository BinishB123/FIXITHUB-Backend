import { ObjectId } from "mongoose"

interface IProviderDateInteractor{
    addDate(date:Date,id:string):Promise<{success?:boolean,id:string}>
    providerAddedDates(id:string):Promise<{success?:boolean,data:{_id:ObjectId,date:Date}[]|[]}>
    updateCount(id:string,toDo:string):Promise<{success?:boolean}>



}


export default IProviderDateInteractor
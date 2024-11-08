

interface IUserProfileInteractor{
    userUpdateData(data:{id:string,newData:string,whichToChange:string}):Promise<{success?:boolean,message?:string,newData?:string}> 
    addOrChangePhoto(data:{id:string,url?:string}):Promise<{success?:boolean,message?:string,url?:string}>



}

export default IUserProfileInteractor
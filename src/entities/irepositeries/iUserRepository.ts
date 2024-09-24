import user from "entities/rules/user"
import { Types } from "mongoose"

interface isUserRepository{
    tempOTp(otp:string,email:string):Promise<{created:boolean}>
    userexist(email:string):Promise<boolean>
}


export default isUserRepository
import AdminRepository from "../../../../interface_adapters/repositories/AdminRepo";
import AdminUser from '../../../../usecases/admin/adminUser'
import AdminUserController from "../../../../interface_adapters/controllers/admin/adminUserController";
import express from "express";
import verification from "../../../express/middleware/jwtAuthenticate";

const adminUserRouter = express.Router()
const adminUserRepo = new AdminRepository()
const adminuserinteractor =  new AdminUser(adminUserRepo)
const controller = new AdminUserController(adminuserinteractor)


adminUserRouter.get('/getuser',verification("admin"),controller.getUser.bind(controller))
adminUserRouter.patch('/blockAndUnblock',verification("admin"),controller.userBlockAndUnblock.bind(controller))





export default adminUserRouter
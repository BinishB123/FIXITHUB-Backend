import express from 'express';
import UserRepository from '../../../../interface_adapters/repositories/userRepo';
import UserServiceInteractor from '../../../../usecases/user/userService';
import UserServiceContoller from '../../../../interface_adapters/controllers/user/userService';

const userServiceRoute = express.Router()
const respository = new UserRepository()
const interactor = new UserServiceInteractor(respository)
const userServiceContoller = new UserServiceContoller(interactor)

userServiceRoute.get('/getservices/:category',userServiceContoller.getServices.bind(userServiceContoller))
userServiceRoute.get('/getallbrands',userServiceContoller.getAllBrands.bind(userServiceContoller))
userServiceRoute.get('/getshops',userServiceContoller.getAllshops.bind(userServiceContoller))
userServiceRoute.get('/getshopdetail',userServiceContoller.getshopProfileWithSelectedServices.bind(userServiceContoller))

 

export default userServiceRoute  
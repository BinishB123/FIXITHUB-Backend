import express from 'express';
import UserRepository from '../../../../interface_adapters/repositories/userRepo';
import UserServiceInteractor from '../../../../usecases/user/userService';
import UserServiceContoller from '../../../../interface_adapters/controllers/user/userService';

const userServiceRoute = express.Router()
const respository = new UserRepository()
const interactor = new UserServiceInteractor(respository)
const userServiceContoller = new UserServiceContoller(interactor)

userServiceRoute.get('/getservices/:category',userServiceContoller.getServices.bind(userServiceContoller))



export default userServiceRoute
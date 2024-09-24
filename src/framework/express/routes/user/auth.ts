import express from 'express';
import UserRepository from '../../../../interface_adapters/repositories/userRepo';
import Mailer from '../../../services/mailer';
import UserAuthInteractor from '../../../../usecases/user/auth';
import AuthController from '../../../../interface_adapters/controllers/user/auth';



const userAuthRouter = express.Router();
const respository = new UserRepository()
const mailer = new Mailer() 
const userAuthInteractor = new UserAuthInteractor(respository,mailer)
const controller  = new AuthController(userAuthInteractor)


userAuthRouter.post('/sendotp',controller.sendotpController.bind(controller))


export default userAuthRouter;

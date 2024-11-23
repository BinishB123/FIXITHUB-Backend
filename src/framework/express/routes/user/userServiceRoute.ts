import express from 'express';
import UserRepository from '../../../../interface_adapters/repositories/userRepo';
import UserServiceInteractor from '../../../../usecases/user/userService';
import UserServiceContoller from '../../../../interface_adapters/controllers/user/userService';
import CheckerDatesIsThereOrNot from '../../../../framework/express/middleware/DateChecker';
import Stripe from '../../../services/stripe';

const userServiceRoute = express.Router()
const respository = new UserRepository()
const interactor = new UserServiceInteractor(respository)
const stripe = new Stripe()
const userServiceContoller = new UserServiceContoller(interactor,stripe)

userServiceRoute.get('/getservices/:category',userServiceContoller.getServices.bind(userServiceContoller))
userServiceRoute.get('/getallbrands',userServiceContoller.getAllBrands.bind(userServiceContoller))
userServiceRoute.get('/getshops',userServiceContoller.getAllshops.bind(userServiceContoller))
userServiceRoute.get('/getshopdetail',userServiceContoller.getshopProfileWithSelectedServices.bind(userServiceContoller))
userServiceRoute.get('/getbookingdates/:id',userServiceContoller.getBookingDates.bind(userServiceContoller))
userServiceRoute.post('/checkout-session',CheckerDatesIsThereOrNot,userServiceContoller.checkOut_Session.bind(userServiceContoller))


 

export default userServiceRoute  
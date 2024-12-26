import StripePayment from "../../../../framework/services/stripe";
import ProviderServiceBookingController from "../../../../interface_adapters/controllers/provider/providerBookingController";
import ProviderRepository from "../../../../interface_adapters/repositories/providerRepo";
import ServiceBookingInteractor from "../../../../usecases/provider/serviceBookingInteractor";
import express from "express";

const providerServiceBookingRoute = express.Router()
const repo = new ProviderRepository()
const stripe = new StripePayment()
const interactor = new ServiceBookingInteractor(repo,stripe)
const providerServiceBookingContoller = new ProviderServiceBookingController(interactor)

providerServiceBookingRoute.get('/getservicebooking/:id/:date', providerServiceBookingContoller.getProviderDataAccordingToDate.bind(providerServiceBookingContoller))
providerServiceBookingRoute.get('/getBookingStillTodaysDate/:id/:startIndex',providerServiceBookingContoller.getBookingStillTodaysDate.bind(providerServiceBookingContoller))
providerServiceBookingRoute.patch('/updatestatus/:id/:status/:amount',providerServiceBookingContoller.updateStatus.bind(providerServiceBookingContoller))
providerServiceBookingRoute.get('/viewbookings/:userid',providerServiceBookingContoller.getBookingGreaterThanTodaysDate.bind(providerServiceBookingContoller))




export default providerServiceBookingRoute
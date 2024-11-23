import ProviderServiceBookingController from "../../../../interface_adapters/controllers/provider/providerBookingController";
import ProviderRepository from "../../../../interface_adapters/repositories/providerRepo";
import ServiceBookingInteractor from "../../../../usecases/provider/serviceBookingInteractor";
import express from "express";

const providerServiceBookingRoute = express.Router()
const repo = new ProviderRepository()
const interactor = new ServiceBookingInteractor(repo)
const providerServiceBookingContoller = new ProviderServiceBookingController(interactor)

providerServiceBookingRoute.get('/getservicebooking/:id/:date', providerServiceBookingContoller.getProviderDataAccordingToDate.bind(providerServiceBookingContoller))
providerServiceBookingRoute.get('/getBookingStillTodaysDate/:id',providerServiceBookingContoller.getBookingStillTodaysDate.bind(providerServiceBookingContoller))
providerServiceBookingRoute.patch('/updatestatus/:id/:status',providerServiceBookingContoller.updateStatus.bind(providerServiceBookingContoller))



export default providerServiceBookingRoute
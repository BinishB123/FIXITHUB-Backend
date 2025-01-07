import express from "express";
import ProviderRepository from "../../../../interface_adapters/repositories/providerRepo";
import ProviderBookingDateInteractor from "../../../../usecases/provider/providerDateInteractor";
import ProviderDateController from "../../../../interface_adapters/controllers/provider/providerDateController";

const providerDateRoute = express.Router();
const repository = new ProviderRepository();
const interactor = new ProviderBookingDateInteractor(repository);
const providerDateController = new ProviderDateController(interactor);

providerDateRoute.post(
    "/adddate",
    providerDateController.addDate.bind(providerDateController)
);
providerDateRoute.get(
    "/getaddeddates/:id",
    providerDateController.addedDates.bind(providerDateController)
);
providerDateRoute.patch(
    "/updateCount/:id/:toDo",
    providerDateController.updateCount.bind(providerDateController)
);

export default providerDateRoute;

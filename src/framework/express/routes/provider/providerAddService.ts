import ProviderRepository from "../../../../interface_adapters/repositories/providerRepo";
import ProviderServicesInteractor from "../../../../usecases/provider/providerServices";
import ProviderAddServiceController from "../../../../interface_adapters/controllers/provider/providerService";
import express from "express";

const providerAddServiceRoute = express.Router();
const respository = new ProviderRepository();
const interactor = new ProviderServicesInteractor(respository);
const controller = new ProviderAddServiceController(interactor);

providerAddServiceRoute.get(
    "/getallorganisedServices",
    controller.getProviderAllService.bind(controller)
);
providerAddServiceRoute.post(
    "/addgeneralorroadservice",
    controller.addGeneralOrRoadService.bind(controller)
);
providerAddServiceRoute.post(
    "/addsubtype",
    controller.addSubTypes.bind(controller)
);
providerAddServiceRoute.patch(
    "/editsubtype",
    controller.editSubType.bind(controller)
);
providerAddServiceRoute.delete(
    "/deletesubtype",
    controller.deleteSubTpe.bind(controller)
);
providerAddServiceRoute.get(
    "/getallbrands",
    controller.getallBrands.bind(controller)
);
providerAddServiceRoute.post(
    "/addbrands",
    controller.addBrands.bind(controller)
);
providerAddServiceRoute.patch(
    "/removeBrand",
    controller.deleteBrand.bind(controller)
);
providerAddServiceRoute.patch(
    "/removerservice/:typeid/:workshopId/:vehicleType",
    controller.removeGeneralOrRoadService.bind(controller)
);

export default providerAddServiceRoute;

import { Application } from "express";
import userRoute from "./user/userRoute";
import providerRouter from "./provider/providerRoutes";


const routes = (app: Application) => {
    // Set up the base /api/user route
    app.use('/api/user', userRoute);
    app.use('/api/provider',providerRouter)
}

export default routes;

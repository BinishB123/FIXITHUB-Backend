import { Application } from "express";
import userRoute from "./user/userRoute";
import providerRouter from "./provider/providerRoutes";
import adminRoute from "../../express/routes/admin/adminRoute";

const routes = (app: Application) => {
    // Set up the base /api/user route
    app.use('/api/user', userRoute,);
    app.use('/api/provider',providerRouter,)
    app.use('/api/admin',adminRoute,)
}

export default routes;
     
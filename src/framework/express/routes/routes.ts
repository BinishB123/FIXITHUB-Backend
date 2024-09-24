import { Application } from "express";
import userRoute from "./user/userRoute";

const   routes = (app: Application) => {
    // Set up the base /api/user route
    app.use('/api/user', userRoute);
}

export default routes;

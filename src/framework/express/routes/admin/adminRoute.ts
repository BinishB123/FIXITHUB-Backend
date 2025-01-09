import expresss from "express";
import AdminAuthRouter from "./auth";
import adminUserRouter from "./adminuser";
import adminProviderRoute from "./adminProvider";
import adminSettingsRoute from "./adminSettings";
import verification from "../../../../framework/express/middleware/jwtAuthenticate";
import adminReportRoute from "./adminReport";
const adminRoute = expresss.Router();
adminRoute.use("/auth", AdminAuthRouter);
adminRoute.use("/user", verification("admin"), adminUserRouter);
adminRoute.use("/providers", verification("admin"), adminProviderRoute);
adminRoute.use("/settings", verification("admin"), adminSettingsRoute);
adminRoute.use('/report',verification("admin"),adminReportRoute)

export default adminRoute;

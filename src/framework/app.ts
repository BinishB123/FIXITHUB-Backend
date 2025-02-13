import express from "express";
import http from "http";
import cors from "cors";
import routes from "./express/routes/routes";
import dontenv from "dotenv";
import cookieParser from "cookie-parser";
import errorHandler from "./express/middleware/Errorhandler";
import session from "express-session";
import "../entities/services/session";
import { SocketIntalization } from "./webSocket/socketIo";

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
dontenv.config();
SocketIntalization(server);
   
app.use(
  session({
    secret: "y1r13t1t3rt77t7g8y3e67",
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  console.log(req.method, req.hostname, req.path, req.body, req.params);
  next();
});

app.use(
  cors({
    origin: "https://binish.site/",
    methods: "GET,PUT,POST,PATCH,OPTIONS,DELETE",
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
    credentials: true,
  })
);

// Use the routes
routes(app);
app.use(errorHandler);

export default server;

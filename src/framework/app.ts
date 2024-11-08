import express from 'express';
import http from 'http';
import cors from 'cors';
import routes from './express/routes/routes';
import dontenv from 'dotenv'
import cookieParser from 'cookie-parser';
import errorHandler from './express/middleware/Errorhandler';

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
dontenv.config()  


app.use((req,res,next) =>{
   console.log(req.method,req.hostname, req.path,req.body);
    next();
});

// Setuped CORS to allow requests from the frontend
app.use(cors({
    origin: 'http://localhost:5173',  //  frontend URL
    methods: 'GET,PUT,POST,PATCH,OPTIONS,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));




// Use the routes
routes(app);
app.use(errorHandler)

export default server;

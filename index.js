import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/connDB.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { userRouter } from './routes/api/User.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/user', userRouter);

const PORT = 3500 || process.env.PORT;

let server;
const startServer = async()=>{
    try{
        await connectDB();
        server = app.listen(PORT,()=>{
            console.log(`App is listening on port ${PORT}`);
        })

    }catch(err){
        process.exit(1);
    }
}

startServer();

process.on('SIGINT', async()=>{
    console.log('Shutting down');
    if (server) server.close(()=> console.log('Server closed')) 

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
})

process.on('SIGTERM', async()=>{
    console.log('Closing down the system');
    if(server) server.close(()=>console.log('Server closed'));

    await mongoose.connection.close();
    console.log('Mongoose connection closed');
    process.exit(0);
})

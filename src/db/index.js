import { DB_NAME } from '../constants.js'
import mongoose from "mongoose";

export const connectDB = async () => { 
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
        mongoose.connection.on('error', (err) => {
            console.log('errror in db connection', err);
        })
        console.log('db connected successfully', connection.connection.host);

    } catch (error) {
        console.log('errror in db connection', error);
        process.exit(1);
    }
}

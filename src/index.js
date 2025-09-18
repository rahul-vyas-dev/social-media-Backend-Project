import { DB_NAME } from "./constants.js";
import mongoose from "mongoose";
import express from "express";
import { connectDB } from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();


connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server is running on port ${process.env.PORT}`);
      app.on("error", (err) => {
        console.log("errror in server connection", err);
      });
    });
  })
  .catch((error) => {
    console.log("errror in db connection", error);
    process.exit(1);
  });

  /*



; (async () => { 
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
        app.on('error', (err) => {
            console.log('errror in db connection', err);
        })
        console.log('db connected successfully', connection.connection.host);
    } catch (error) {
        console.log('errror in db connection', error);
        process.exit(1);
    }
})()
*/


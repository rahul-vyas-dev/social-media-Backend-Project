import { request } from "express";
// import app from "../app";

const asyncHandler = (requestHandler) => 
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };

export { asyncHandler };

/*const asyncHandler = (fn) => async (res, req, next) => { 
    try {
        await fn(res, req, next);
        app.on('error', (err) => {
            console.log('error in async handler', err);
        })
    } catch (error) {
        console.log('error in async handler', error);        
        // next(error);
        res.status(500).json({ sucess:false,message: "Internal Server Error" });
    }
}*/

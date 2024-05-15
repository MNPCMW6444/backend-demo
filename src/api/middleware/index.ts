import {Error} from "mongoose";
import {NextFunction, Request, Response} from "express";

export const serverErrorHandler = async (err: Error, _: Request, res: Response, next: NextFunction) => {
    if (err) {
        /*try {
          await new (errorLogModel())({
            stringifiedError: err.toString(),
          }).save();
           console.log("Error was logged to DB");
        } catch (e) {
           console.log("Error logging error to DB: ", e);
        }*/ // can be implemented in the future, depending on logging stategy
        if (!res.headersSent) {
            return res.status(500).send("Server error");
        }
    } else {
        next(err);
    }
};

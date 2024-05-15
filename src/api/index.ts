import cors from "cors";
import express, {Request, Response} from "express";
import apiRouter from "./routes";
import settings from "../config";
import {serverErrorHandler} from "./middleware";

const app = express();
const port = settings.selfPort;

const middlewares = [
    express.json(),
    cors({
        origin: Object.values(settings.clientDomains),
        credentials: true, // this will help implementing jwt-based auth in the future
    }),
];

export default async () => {
    console.log("Starting Server...");
    try {
        middlewares.forEach((middleware) => app.use(middleware));

        const liveCheckEndPointhandler = (_: Request, res: Response) => {
            res.json({
                status: "Im alive and healthy, connected to dB",
                stagingEnv: settings.stagingEnv,
            });
        };

        app.get("/", liveCheckEndPointhandler);
        app.get("/api", liveCheckEndPointhandler);

        app.use("/api", apiRouter);

        app.use(serverErrorHandler);

        app.listen(port, "0.0.0.0", () => {
            console.log(
                "Server is ready at http" +
                (settings.stagingEnv === "local"
                    ? "://localhost:" + port + "/"
                    : "s://" +
                    (settings.stagingEnv === "preprod" ? "pre" : "") +
                    `server.${settings.selfDomain}.com/`),
            );
        });
    } catch (e) {
        throw new Error("Express setup failed: " + JSON.stringify(e));
    }
};

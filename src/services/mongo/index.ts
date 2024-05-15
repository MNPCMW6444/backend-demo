import mongoose, {Connection} from "mongoose";
import settings from "../../config";

let connection: Connection | null = null;

export const connect = async (): Promise<Connection> => {
    if (connection) {
        return connection;
    }
    settings.nodeEnv === "development" && mongoose.set("debug", true);
    try {
        await mongoose.connect(settings.mongoURI);
        console.log("MongoDB connected successfully");
        connection = mongoose.connection;
        return connection;
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
};

export const getConnection = (): Connection => {
    if (!connection) {
        throw new Error("Database not initialized - call connect first");
    }
    return connection;
};

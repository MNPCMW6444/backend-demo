import mongoose, {SchemaDefinition} from "mongoose";
import settings from "../../config";

export let connection: mongoose.Connection | null = null;

export const connect = async () => {
    settings.nodeEnv === "development" && mongoose.set("debug", true);
    try {
        await mongoose.connect(
            settings.mongoURI,
        );
        console.log("Mongo DB connected successfully");
        connection = mongoose.connection;
    } catch (err) {
        console.log("mongo connection error:" + err);
        throw new Error(JSON.stringify(err));
    }
};

export const getModel = <Interface>(
    name: string,
    schemaDefinition: SchemaDefinition,
    extraIndex = undefined,
) => {
    if (!connection) throw new Error("Database not initialized");
    const schema = new mongoose.Schema(schemaDefinition, {
        timestamps: true,
    });
    extraIndex && schema.index(extraIndex);
    return connection.model<Interface>(name);
};

export default connection

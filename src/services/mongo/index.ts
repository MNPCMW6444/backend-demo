import mongoose, {SchemaDefinition} from "mongoose";
import settings from "../../config";

export let index: mongoose.Connection | null = null;

export const connect = async () => {
    settings.nodeEnv === "development" && mongoose.set("debug", true);
    try {
        await mongoose.connect(
            settings.mongoURI,
        );
        console.log("Mongo DB connected successfully");
        index = mongoose.connection;
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
    if (!index) throw new Error("Database not initialized");
    const schema = new mongoose.Schema(schemaDefinition, {
        timestamps: true,
    });
    extraIndex && schema.index(extraIndex);
    return index.model<Interface>(name);
};

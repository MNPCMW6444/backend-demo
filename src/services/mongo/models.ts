import mongoose, {SchemaDefinition, Model} from "mongoose";
import {getConnection} from "./";
import buildUserModel, {IUser} from "./schemas/users";
import buildGroupModel, {IGroup} from "./schemas/groups";

export const buildModel = <Interface>(
    name: string,
    schemaDefinition: SchemaDefinition,
    extraIndex?: any
): Model<Interface> => {
    if (!getConnection()) throw new Error("Database not initialized");
    // Check if the model has already been built
    if (mongoose.models[name]) {
        return mongoose.models[name] as Model<Interface>;
    } else {
        const schema = new mongoose.Schema(schemaDefinition, {
            timestamps: true,
        });
        if (extraIndex) {
            schema.index(extraIndex);
        }
        return getConnection().model<Interface>(name, schema);
    }
};


let UserModel: mongoose.Model<IUser> | undefined;
let GroupModel: mongoose.Model<IGroup> | undefined;

export const initializeModels = () => {
    UserModel = buildUserModel();
    GroupModel = buildGroupModel();
};

export const getUserModel = () => {
    if (!UserModel) throw new Error("UserModel has not been initialized");
    return UserModel;
};

export const getGroupModel = () => {
    if (!GroupModel) throw new Error("GroupModel has not been initialized");
    return GroupModel;
};


import {buildModel} from "../../models";
import mongoose, {ObjectId} from "mongoose";

export enum UserStatus {
    Pending = "Pending",
    Active = "Active",
    Blocked = "Blocked",
}

export interface IUser {
    _id: ObjectId;
    email: string;
    name?: string;
    status: UserStatus;
    associatedGroup?: ObjectId,
}

export default () =>
    buildModel<IUser>("user", {
        email: {type: String, unique: true,},
        name: {type: String,},
        status: {type: String, enum: Object.values(UserStatus)},
        associatedGroup: {type: mongoose.Schema.Types.ObjectId, ref: 'group'},
    });

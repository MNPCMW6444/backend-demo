import {getModel} from "..";
import mongoose, {ObjectId} from "mongoose";

export enum UserStatus {
    Pending = "Pending",
    Active = "Active",
    Blocked = "Blocked",
}

interface User {
    _id: ObjectId;
    email: string;
    name?: string;
    status: UserStatus;
    associatedGroup?: ObjectId,
}

export default () =>
    getModel<User>("user", {
        email: {type: String, unique: true,},
        name: {type: String,},
        status: {type: String, enum: Object.values(UserStatus)},
        associatedGroup: {type: mongoose.Schema.Types.ObjectId, ref: 'group'},
    });

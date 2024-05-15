import {getModel} from "..";
import {ObjectId} from "mongoose";

enum UserStatus {
    Pending = "Pending",
    Active = "Active",
    Blocked = "Blocked",
}


interface User {
    _id: ObjectId;
    email: string;
    name?: string;
    status: UserStatus;
}


export default () =>
    getModel<User>("user", {
        email: {
            type: String,
            unique: true,
        },
        name: {
            type: String,
        },
        status: {type: String, enum: Object.values(UserStatus)},

    });

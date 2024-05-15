import {getModel} from "..";
import {ObjectId} from "mongoose";

enum GroupStatus {
    Empty = "Empty",
    NotEmpty = "NotEmpty",
}


interface Group {
    _id: ObjectId;
    status: GroupStatus;
}


export default () =>
    getModel<Group>("group", {
        status: {type: String, enum: Object.values(GroupStatus)},
    });

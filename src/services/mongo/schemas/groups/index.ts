import {buildModel} from "../../models";
import {ObjectId} from "mongoose";

export enum GroupStatus {
    Empty = "Empty",
    NotEmpty = "NotEmpty",
}


export interface IGroup {
    _id: ObjectId;
    status: GroupStatus;
}


export default () =>
    buildModel<IGroup>("group", {
        status: {type: String, enum: Object.values(GroupStatus)},
    });

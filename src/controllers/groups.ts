import {getUserModel} from "../services/mongo/models";
import {GroupStatus, IGroup} from "../services/mongo/schemas/groups";
import {Document} from "mongoose"

export const updateGroupStatus = async (group: Document<unknown, {}, IGroup> & IGroup) => {
    const Users = getUserModel();
    const associatedUsers = await Users.find({associatedGroup: group._id});
    if (associatedUsers.length === 0) {
        group.status = GroupStatus.Empty;
        await group.save();
    }
};

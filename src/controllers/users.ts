import {UserStatus} from "../services/mongo/schemas/users";
import {getGroupModel, getUserModel} from "../services/mongo/models";
import {getConnection} from "../services/mongo";
import {isValidObjectId} from "mongoose";
import {updateGroupStatus} from "./groups";

interface StatusUpdate {
    userId: string;
    newStatus: UserStatus;
}

export const getAllUsers = (limit: number, offset: number) => {
    const Users = getUserModel();
    return Users.find().limit(limit).skip(offset).lean();
};

export const getUsersByName = (name: string) => {
    const Users = getUserModel();
    return Users.find({name}).lean();
};

export const getUsersByEmail = (email: string) => {
    const Users = getUserModel();
    return Users.find({email}).lean();
};

export const updateStatuses = async (updates: StatusUpdate[]) => {
    const Users = getUserModel();
    const session = await getConnection().startSession();
    try {
        session.startTransaction();
        const bulkOps = updates.map(({userId, newStatus}) => ({
            updateOne: {
                filter: {_id: userId},
                update: {$set: {status: newStatus}},
            },
        }));
        await Users.bulkWrite(bulkOps, {session, ordered: false});
        await session.commitTransaction();
        return {success: true};
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};

export const removeUserFromGroup = async (userId: string) => {
    if (!isValidObjectId(userId)) throw new Error(JSON.stringify({
        code: 400,
        message: "A valid user ID is required"
    }));
    
    const Users = getUserModel();
    const Groups = getGroupModel();
    const user = await Users.findById(userId);

    if (!user) throw new Error(JSON.stringify({code: 404, message: "No user found for given user ID"}));
    if (!user.associatedGroup) throw new Error(JSON.stringify({
        code: 400,
        message: "This user is already not associated with any group"
    }));
    const group = await Groups.findById(user.associatedGroup);

    const session = await getConnection().startSession();
    session.startTransaction();
    try {
        user.associatedGroup = undefined;
        await user.save();
        group && await updateGroupStatus(group)

        await session.commitTransaction();
        return {success: true};
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};


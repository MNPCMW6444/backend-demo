import {Request, Response, NextFunction} from 'express';
import {getUserModel, getGroupModel} from "../services/mongo/models";
import {isValidObjectId} from "mongoose";
import {getConnection} from "../services/mongo";
import {GroupStatus} from "../services/mongo/schemas/groups";

export const removeUserFromGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        if (!isValidObjectId(userId)) return res.status(400).send("A valid user ID is required");
        const Users = getUserModel();
        const Groups = getGroupModel();
        const user = await Users.findById(userId);
        if (!user) return res.status(404).send("no user found for given user ID");
        if (!user.associatedGroup) return res.status(400).send("this user is already not associated with any group");
        const group = await Groups.findById(user.associatedGroup);
        const session = await getConnection().startSession();
        session.startTransaction();
        try {
            user.associatedGroup = undefined;
            await user.save({session});
            if (group) {
                const associatedUsers = await Users.find({associatedGroup: group._id}, null, {session});
                if (associatedUsers.length === 0) {
                    group.status = GroupStatus.Empty;
                    await group.save({session});
                }
            }
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            res.status(500).send(`Remove failed: ${error}`);
        } finally {
            await session.endSession();
        }
        res.status(201).send("success");
    } catch (e) {
        next(e);
    }
}

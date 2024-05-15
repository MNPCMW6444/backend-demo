import {Request, Response, NextFunction} from 'express';
import {UserStatus} from "../services/mongo/schemas/users";
import {getUserModel} from "../services/mongo/models";
import {getConnection} from "../services/mongo";

interface StatusUpdate {
    userId: string;
    newStatus: UserStatus;
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = parseInt(req.params.limit) || 10;
        const skip = parseInt(req.params.offset) || 0;
        const Users = getUserModel();
        const allUsers = await Users.find().limit(limit).skip(skip).lean();
        res.status(200).json(allUsers);
    } catch (e) {
        next(e);
    }
}

export const getUserByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const name = req.params.name;
        if (!name) return res.status(400).send("Name is required");
        const Users = getUserModel();
        const usersResult = await Users.find({name}).lean();
        res.status(200).json(usersResult);
    } catch (e) {
        next(e);
    }
}

export const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.params.email;
        if (!email) return res.status(400).send("Email Address is required");
        const Users = getUserModel();
        const usersResult = await Users.find({email}).lean();
        res.status(200).json(usersResult);
    } catch (e) {
        next(e);
    }
}

export const updateStatuses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updates: StatusUpdate[] = req.body.updates;
        if (!updates || updates.length === 0) {
            return res.status(400).send("Updates are required");
        }
        const Users = getUserModel();
        const session = await getConnection().startSession(); // no need to check if db is non-null because the model exists and the whole express is set up after db connection
        session.startTransaction();
        try {
            const bulkOps = updates.map(({userId, newStatus}) => ({
                updateOne: {
                    filter: {_id: userId},
                    update: {$set: {status: newStatus}}
                }
            }));
            await Users.bulkWrite(bulkOps);
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            res.status(500).send(`Update failed: ${error}`);
        } finally {
            await session.endSession();
        }
        res.status(201).send("Updates successful");
    } catch (error) {
        next()
    }
}

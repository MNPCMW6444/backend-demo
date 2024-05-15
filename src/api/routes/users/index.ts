import {Router} from "express";
import UsersModelBuilder, {UserStatus} from "../../../services/mongo/users"
import {isValidObjectId} from "mongoose";
import db from "../../../services/mongo";

const router = Router();

router.get("/all/:limit/:offset", async (req, res, next) => {
    try {
        const limit = parseInt(req.params.limit) || 10;
        const skip = parseInt(req.params.offset) || 0;
        const Users = UsersModelBuilder()
        const allUsers = (Users.find().limit(limit).skip(skip))
        return res.status(200).json(allUsers)
    } catch (e) {
        next(e)
    }
});

router.get("/byName/:name", async (req, res, next) => {
    try {
        const name = req.params.name
        if (!name) return res.status(400).send("Name is required");
        const Users = UsersModelBuilder()
        const usersResult = (Users.find({name}))
        return res.status(200).json(usersResult)
    } catch (e) {
        next(e)
    }
});

router.get("/byEmailAddress/:email", async (req, res, next) => {
    try {
        const email = req.params.email
        if (!email) return res.status(400).send("Email Address is required");
        const Users = UsersModelBuilder()
        const usersResult = (Users.find({email}))
        return res.status(200).json(usersResult)
    } catch (e) {
        next(e)
    }
});

interface StatusUpdate {
    userId: string;
    newStatus: UserStatus
}

router.patch<{}>("/statuses/:email", async (req, res, next) => {
    try {
        const updates: StatusUpdate[] = req.body.updates
        if (!updates || updates.length === 0) return res.status(400).send("Updates are required");
        const Users = UsersModelBuilder();
        if (!db) throw Error("not connected to DB")
        const session = await db.startSession();
        session.startTransaction();
        try {
            const bulkOps = updates.map(({userId, newStatus}) => ({
                updateOne: {
                    filter: {_id: userId},
                    update: {$set: {status: newStatus}}
                }
            }));
            await Users.bulkWrite(bulkOps, {session, ordered: false});
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw Error("Update was unsuccessful")
        }
        return res.status(201).send("update initiated/done?")
    } catch (e) {
        next(e)
    }

});

router.delete("/userFromGroup/:userId", async (req, res, next) => {
    try {
        const userId = req.params.userId
        if (!isValidObjectId(userId)) return res.status(400).send("A valid user ID is required");
        const Users = UsersModelBuilder()
        const user = await Users.findById(userId);
        if (!user) return res.status(404).send("no user found for given user ID");
        user.associatedGroup = undefined
        await user.save()
        return res.status(201).send("success")
    } catch (e) {
        next(e)
    }
});


/*


Update Users Statuses
Create an endpoint that allows updating *multiple* users statuses by their IDs (Each user can be updated to a *different* status in this request).
Statuses can be pending, active or blocked)
This endpoint can potentially receive up to 500 users to change to new statuses, this is n’t small scale, try and fix any potential bottlenecks and if you're not sure how, write in a comment your best suggestion

Remove user from group
Users can be associated with one or zero groups
When removing a user from a group, you must check if the group has no more members, if it has no more members (users associated with that group) you must update that group status to empty
A group status can be empty, notEmpty

*/

export default router;

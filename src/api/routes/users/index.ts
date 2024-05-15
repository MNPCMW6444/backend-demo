import {Router} from "express";
import {
    getAllUsers,
    getUsersByEmail,
    getUsersByName,
    removeUserFromGroup,
    updateStatuses
} from "../../../controllers/users";

const router = Router();

router.get("/all", async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;
        const users = await getAllUsers(limit, offset);
        return res.status(200).json(users);
    } catch (e) {
        next(e);
    }
});

router.get("/byName/:name", async (req, res, next) => {
    try {
        const name = req.params.name;
        if (!name) return res.status(400).send("Name is required");
        const users = await getUsersByName(name);
        return res.status(200).json(users);
    } catch (e) {
        next(e);
    }
});

router.get("/byEmailAddress/:email", async (req, res, next) => {
    try {
        const email = req.params.email;
        if (!email) return res.status(400).send("Email Address is required");
        const users = await getUsersByEmail(email);
        return res.status(200).json(users);
    } catch (e) {
        next(e);
    }
});

router.patch("/statuses", async (req, res, next) => {
    const updates = req.body.updates;
    if (!updates || updates.length === 0) {
        return res.status(400).send("Updates are required");
    }
    //I would add zod to further validate the input, or utilize typescript even more if its inside a monorepo with the frontend
    try {
        await updateStatuses(updates);
        res.status(201).send("Updates successful");
    } catch (e) {
        next(e);
    }
});

router.delete("/userFromGroup/:userId", async (req, res, next) => {
    try {
        const userId = req.params.userId;
        await removeUserFromGroup(userId);
        return res.status(201).send("Success");
    } catch (e) {
        const non500Error = JSON.parse(e as string)
        if (non500Error) return res.status(non500Error.code).send(non500Error.message)
        else next(e);
    }
});

export default router;

import {Router} from 'express';
import {getAllUsers, getUserByEmail, getUserByName, updateStatuses} from "../../../controllers/users";
import {removeUserFromGroup} from "../../../controllers/groups";

const router = Router();

router.get("/all/:limit/:offset", getAllUsers);
router.get("/byName/:name", getUserByName);
router.get("/byEmailAddress/:email", getUserByEmail);
router.patch("/statuses", updateStatuses);
router.delete("/userFromGroup/:userId", removeUserFromGroup);

export default router;

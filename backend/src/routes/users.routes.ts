import express from "express";
import * as usersController from "../controllers/users.controller";

const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUser);
router.post("/", usersController.createUser);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);
router.get("/:id/channels", usersController.getUserChannels);
router.post("/:id/channels", usersController.addUserChannel);
router.delete("/:id/channels/:channelId", usersController.removeUserChannel);

module.exports = router;

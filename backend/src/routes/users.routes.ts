import express from "express";
import * as usersController from "../controllers/users.controller";
import * as authController from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUser);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);
router.get("/:id/channels", usersController.getUserChannels);
router.post("/:id/channels", usersController.addUserChannel);
router.delete("/:id/channels/:channelId", usersController.removeUserChannel);

module.exports = router;

import express from "express";
import * as usersController from "../controllers/users.controller";
import * as authController from "../controllers/auth.controller";
import { checkJwtToken } from "~/middlewares/auth.middleware";

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUser);
router.put("/:id", checkJwtToken, usersController.updateUser);
router.delete("/:id", checkJwtToken, usersController.deleteUser);
router.get("/:id/channels", checkJwtToken, usersController.getUserChannels);
router.post("/:id/channels", checkJwtToken, usersController.addUserChannel);
router.delete(
  "/:id/pmsgs/:pmsgId",
  checkJwtToken,
  usersController.removeUserChannel
);
router.get("/:id/pmsgs", checkJwtToken, usersController.getUserPmsgs);

module.exports = router;

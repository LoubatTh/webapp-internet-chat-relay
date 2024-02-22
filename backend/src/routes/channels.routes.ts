import express from "express";
import * as channelsController from "../controllers/channels.controller";
import { checkJwtToken } from "~/middlewares/auth.middleware";

const router = express.Router();

router.get("/", channelsController.getChannels);
router.get("/:id", channelsController.getChannel);
router.post("/", checkJwtToken, channelsController.createChannel);
router.put("/:id", checkJwtToken, channelsController.updateChannel);
router.delete("/:id", checkJwtToken, channelsController.deleteChannel);

module.exports = router;

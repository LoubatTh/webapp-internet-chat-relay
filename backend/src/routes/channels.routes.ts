import express from "express";
import * as channelsController from "../controllers/channels.controller";

const router = express.Router();

router.get("/", channelsController.getChannels);
router.get("/:id", channelsController.getChannel);
router.post("/", channelsController.createChannel);
router.put("/:id", channelsController.updateChannel);
router.delete("/:id", channelsController.deleteChannel);
router.get("/n/:name", channelsController.getChannelByName);
router.get("/:id/members", channelsController.getMembersChannel);

module.exports = router;

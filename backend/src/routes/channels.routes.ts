import express from "express";
import * as channelsController from "../controllers/channels.controller";
import { checkJwtToken } from "~/middlewares/auth.middleware";

const router = express.Router();

router.get("/", channelsController.getChannels);
router.get("/:id", channelsController.getChannel);
router.post("/", channelsController.createChannel);
router.put("/:id", channelsController.updateChannel);
router.delete("/:id", channelsController.deleteChannel);
router.delete("/:id", checkJwtToken, channelsController.deleteChannel);

module.exports = router;

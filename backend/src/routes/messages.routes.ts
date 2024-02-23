import express from "express";
import * as messagesController from "../controllers/messages.controller";

const router = express.Router();

router.get("/:channelId", messagesController.getMessages);
router.get("/:channelId/:id", messagesController.getMessage);
router.post("/:channelId", messagesController.createMessage);
router.put("/:channelId/:id", messagesController.updateMessage);
router.delete("/:channelId/:id", messagesController.deleteMessage);

module.exports = router;

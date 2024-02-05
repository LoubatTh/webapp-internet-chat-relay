import express from "express";
import * as messagesController from "../controllers/messages.controller";

const router = express.Router();

router.get("/:channelId/messages", messagesController.getMessages);
router.get("/:channelId/messages/:id", messagesController.getMessage);
router.post("/:channelId/messages", messagesController.createMessage);
router.put("/:channelId/messages/:id", messagesController.updateMessage);
router.delete("/:channelId/messages/:id", messagesController.deleteMessage);

export default router;

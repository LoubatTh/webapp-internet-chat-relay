import express from "express";
import * as guestsController from "../controllers/guests.controller";

const router = express.Router();

router.get("/", guestsController.getGuests);
router.get("/:id", guestsController.getGuest);
router.post("/", guestsController.createGuest);
router.put("/:id", guestsController.updateGuest);
router.delete("/:id", guestsController.deleteGuest);
router.get("/:id/channels", guestsController.getGuestChannels);
router.post("/:id/channels", guestsController.addGuestChannel);
router.delete("/:id/channels/:channelId", guestsController.removeGuestChannel);
router.get("/:id/pmsgs", guestsController.getUserPmsgs);

module.exports = router;

import express from "express";
import * as psmgController from "~/controllers/pmsgs.controller";

const router = express.Router();

router.get("/", psmgController.getPmsgs);
router.get("/:id", psmgController.getPmsg);
router.post("/", psmgController.createPmsg);
router.delete("/:id", psmgController.deletePmsg);

module.exports = router;

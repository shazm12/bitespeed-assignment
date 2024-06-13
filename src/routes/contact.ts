import { Router } from "express";
import { createContactDetail, identifyContactDetails } from "../controllers/contact";

const router: Router  = Router();

router.post("/create", createContactDetail);
router.post("/identify", identifyContactDetails);


export default router;
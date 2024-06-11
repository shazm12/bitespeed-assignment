import { Router } from "express";
import { createContactDetail, identifyContactDetails } from "../controllers/Contact";

const router: Router  = Router();

router.post("/create", createContactDetail);
router.post("/identify", identifyContactDetails);


export default router;
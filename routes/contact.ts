import { Router } from "express";
import { createContactDetail } from "../controllers/Contact";

const router: Router  = Router();

router.post("/create", createContactDetail);

export default router;
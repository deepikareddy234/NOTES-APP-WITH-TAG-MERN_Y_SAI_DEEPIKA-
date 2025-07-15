import express from "express";
import { signin, signout, signup } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout); // ✅ removed verifyToken

export default router;

import express from "express";
import { signin, signup, showUser, getUserByEmail } from "../controller/user.js";

const router = express.Router();

router.get("/showUser", showUser);
router.post("/signUp", signup);
router.post("/signIn", signin);
router.post("/getUserByEmail", getUserByEmail);




export default router;
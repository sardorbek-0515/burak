import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";



router.post("/login/", memberController.login); // CALL
router.post("/signup", memberController.signup);



export default router;
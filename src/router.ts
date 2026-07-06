import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";


/** MEMBER  **/
router.post("/login/", memberController.login); // CALL
router.post("/signup", memberController.signup);
router.get("/member/detail", memberController.verifyAuth);



/** PRODUCT  **/

/** ORDER  **/
export default router;
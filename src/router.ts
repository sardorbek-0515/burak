import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";


/** MEMBER  **/
router.post("/login/", memberController.login); // CALL
router.post("/signup", memberController.signup);
router.post("/member/logout", memberController.verifyAuth, memberController.logout);
router.get("/member/detail", memberController.verifyAuth, memberController.getMemberDetail);



/** PRODUCT  **/

/** ORDER  **/
export default router;
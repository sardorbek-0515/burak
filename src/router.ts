import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import uploader from "./libs/utils/uploader";

/** MEMBER **/
router.post("/member/login", memberController.login);
router.post("/member/signup", memberController.signup);
router.post(
    "/member/logout",
    memberController.verifyAuth,
    memberController.logout);
router.get(
    "/member/detail",
    memberController.verifyAuth,
    memberController.getMemberDetail);

router.post(
    "/member/update",
    memberController.verifyAuth,
    uploader("members").single("memberImage"), //upoloadsni member folferiga yuklashini va faylni nomini memberImage qilib olishini bildiradi 
    memberController.updateMember//memberni update qilish uchun route    
);

/** PRODUCT **/

/** ORDER **/
export default router;
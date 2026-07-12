import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import uploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";

/** MEMBER **/
router.get("/member/restaurant", memberController.getRestaurant);
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
    memberController.verifyAuth,// login bolmagan user
    uploader("members").single("memberImage"), //upoloadsni member folferiga yuklashini va faylni nomini memberImage qilib olishini bildiradi 
    memberController.updateMember//memberni update qilish uchun route    
);
router.get("/member/top-users", memberController.getTopUsers);


/** PRODUCT **/
router.get("/product/all", productController.getProducts);
router.get("/product/:id",
    memberController.retrieveAuth,//agar authacation bolgan bolsa memberni req ga biriktir /login bolmasa ham, kn yuzerga otadi
    productController.getProduct)


/** ORDER **/
router.post(
    "/order/create",
    memberController.verifyAuth,
    orderController.createOrder
);

router.get(
    "/order/all",
    memberController.verifyAuth,
    orderController.getMyOrders,
);
// router.post(
//     "/order/update",
//     memberController.verifyAuth,
//     orderController.updateOrder,
// );

export default router;
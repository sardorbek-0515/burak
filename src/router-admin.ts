import express from "express";
const routerAdmin = express.Router();
import restaurantController from "./controllers/restaurant.controller";
import productController from "./controllers/product.controller";
import makeUploader from "./libs/utils/uploader";

//get qandaydur ma lumot olish uchun ishlatiladi
// post- mutetion malumotni ozgartirish uchun 

/**                         Restaurant     *////////////////////////////

//goHome   
routerAdmin.get("/", restaurantController.goHome);  //traditional API  (chunki HTML/EJS qaytaradi).

//processLogin
routerAdmin
  .get("/login", restaurantController.getLogin)          //Traditional API
  .post("/login/", restaurantController.processLogin      //Traditional AP
  );



//processSignup
routerAdmin
  .get("/signup", restaurantController.getSignup)            //Traditional API  
  .post(
    "/signup",
    makeUploader("members").single("memberImage"),
    restaurantController.processSignup,
  );

//logout
routerAdmin.get("/logout", restaurantController.logout);//          Traditional API 

//checkAuthSession
routerAdmin.get("/check-me", restaurantController.checkAuthSession);  // Traditional API 





/**            Product          */ // MVS /call                  ///////////////////////

//getAllProducts
routerAdmin.get(
  "/product/all",
  restaurantController.verifyRestaurant, //AUTHORIZATION login bolganmi  // restpi
  productController.getAllProducts
);
//createNewProduct                       //REST
routerAdmin.post(
  "/product/create",
  restaurantController.verifyRestaurant,  //AUTHORIZATION req. +member
  // uploadProductImage.single("productImages"),
  makeUploader("products").array("productImages", 5),// UPLOADER req.+files
  productController.createNewProduct // req.member & req.files
);


//updateChosenProduct
routerAdmin.post(
  "/product/:id",
  restaurantController.verifyRestaurant, //typni tekshirish           // restpi
  productController.updateChosenProduct
);

/** User member */ //bizni restuarantes userlarni malumotini ozgartirish!
routerAdmin.get(
  "/user/all",
  restaurantController.verifyRestaurant,
  restaurantController.getUsers
);
routerAdmin.post(
  "/user/edit",
  restaurantController.verifyRestaurant,
  restaurantController.updateChosenUser            //restpi
);




export default routerAdmin;
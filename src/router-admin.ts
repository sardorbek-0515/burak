import express from "express";
const routerAdmin = express.Router();
import restaurantController from "./controllers/restaurant.controller";

//get qandaydur ma lumot olish uchun ishlatiladi
// post- mutetion malumotni ozgartirish uchun 

/** Restaurant  */
routerAdmin.get("/", restaurantController.goHome);
routerAdmin
.get("/login", restaurantController.getLogin)
.post("/login/", restaurantController.processLogin);
routerAdmin
.get("/logout", restaurantController.logout)
.post("/signup", restaurantController.processSignup);


routerAdmin
.get("/signup", restaurantController.getSignup)
routerAdmin.get("/check-me", restaurantController.checkAuthSession);

/** Product */
//**User */

export default routerAdmin;
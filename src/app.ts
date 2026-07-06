import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan"
import { MORGAN_FORMAT } from "./libs/config";

import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import { T } from "./libs/types/comman";
//TCP2
const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions",
});

/** 1-ENTRANCE    **/
const app = express();
console.log("__dirname:", __dirname)
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // obect beradi Rest API support
import cookieParser from "cookie-parser";
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT));


/** 2-SESSIONS   **/
// req. +session > TAMG'A yaratish & TASDIQLASH
//yani req seesion paydo boladi shuni yozsak
app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 3600 * 6, // 6h
    },
    store: store,
    resave: true,  //kirganda vaqt yamgilaydi 
    saveUninitialized: true,  //login qilmagan foydalanuvchi uchun ham session yaratadi
  })
);
app.use(function (req, res, next) {    //umumiy middleware qo'shyapsiz
  const sessionInstance = req.session as T;
  res.locals.member = sessionInstance.member;
  next();
});

/** 3-VIEWS    **/
app.set('views', path.join(__dirname, "views")); //
app.set("view engine", "ejs");//

/** 4-ROUTERS   **/
app.use("/admin", routerAdmin);    // SSR: EJS togridan togri. admin
app.use("/", router);              // SPA: REACT rest API orqali.clent

export default app; //module.exports 
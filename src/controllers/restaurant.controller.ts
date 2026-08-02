import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/comman";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";


const memberService = new MemberService(); //


const restaurantController: T = {};

//goHome
restaurantController.goHome = (req: Request, res: Response) => {// bu controller admin panelining home page ni render qiladigan controller //RENDER uzi nima? render bu view ni render qiladi yani home.ejs ni ochadi va unga datani pass qiladi
    try {  //RENDER uzi nimaga? render bu view ni render qiladi yani home.ejs ni ochadi va unga datani pass qiladi
        console.log("goHome")
        // send, json, redirect, end, render
        res.render("home");
    } catch (err) {
        console.log("Error, goHome:", err)
        res.redirect("/admin");//xatolik bolganda adminga yuboradi
    }
};
//getSignup
restaurantController.getSignup = (req: Request, res: Response) => {
    try {
        console.log("getSignup")//
        res.render("signup");//re
    } catch (err) {
        console.log("Error, getSignup:", err)
        res.redirect("/admin");
    }
};



//getLogin         //call
restaurantController.getLogin = (req: Request, res: Response) => {
    try { //render
        console.log("getLogin") // console.log(req.body) // formadan kelgan datani ko'rsatadi
        res.render("login");
    } catch (err) {
        console.log("Error, getLogin:", err)
        res.redirect("/admin");
    }
};


//processSignup
restaurantController.processSignup = async (req: AdminRequest, res: Response) => {//
    try {
        console.log("processSignup")// console.log(req.body) // formadan kelgan datani ko'rsatadi
        console.log("req.body:", req.body);// formadan kelgan datani ko'rsatadi
        const file = req.file;
        if (!file) throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);// agar fayl kelmagan bo'lsa, xatolik tashlaydi


        const newMember: MemberInput = req.body;
        newMember.memberImage = file?.path.replace(/\\/g, "/");
        newMember.memberType = MemberType.RESTAURANT;
        const result = await memberService.processSignup(newMember);
        //TODO: SESSIONS AUTHENTICATION

        req.session.member = result;
        req.session.save(function () {
            res.redirect("/admin/product/all");
        });

    } catch (err) {
        console.log("Error, processSignup:", err)
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG
        res.send(`<script> alert("${message}"); window.location.replace('/admin/signup') </script>`)

    }
};

//processLogin //// req. +session > TAMG'A 
restaurantController.processLogin = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processLogin")
        console.log("req.body:", req.body);

        const input: LoginInput = req.body;
        const result = await memberService.processLogin(input);
        //TODO: SESSIONS AUTHENTICATION

        req.session.member = result;
        req.session.save(function () {
            res.redirect("/admin/product/all");
        });

    } catch (err) {
        console.log("Error, processLogin:", err)
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG
        res.send(`<script> alert("${message}"); window.location.replace('/admin/login') </script>`)
    }
};



//logout
restaurantController.logout = async (req: AdminRequest, res: Response) => {
    try {
        console.log("logout");
        req.session.destroy(function () {
            res.redirect("/admin");
        });
    } catch (err) {
        console.log("Error, processLogin:", err)
        res.redirect("/admin");
    }
};



//getUsers
// define     /adminka memberlarni malumotini ozgartirish
restaurantController.getUsers = async (req: Request, res: Response) => {
    try {
        console.log("getUsers");
        const result = await memberService.getUsers(); //call qilinadigan metod memberService obyektida mavjud bo'lgan getUsers metodini chaqiradi va uning natijasini result o'zgaruvchisiga saqlaydi. Bu metod barcha foydalanuvchilarni olish uchun ishlatiladi.
        console.log("result", result);

        res.render("users", { users: result }); //2 TA ARGUMNET pass  objectni ichida resultni beryabmiz
    } catch (err) {
        console.log("Error, getUsers:", err); //
        res.redirect("/admin/login"); //xatolik bolganda loginga yubor
    }
};


//updateChosenUser
//define
restaurantController.updateChosenUser = async (req: Request, res: Response) => {
    try {
        console.log("updateChosenUser");//
        const result = await memberService.updateChosenUser(req.body);

        res.status(HttpCode.OK).json({ data: result });//
    } catch (err) {
        console.log("Error updateChosenUser:", err); //xatolikni konsolga chiqaradi
        if (err instanceof Errors) res.status(err.code).json(err)//agar err Errors tipida bo'lsa, err.code bilan statusni o'rnatadi va err ni json formatida yuboradi
        else res.status(Errors.standard.code).json(Errors.standard);//
    }
};


//checkAuthSession
restaurantController.checkAuthSession = async (req: AdminRequest, res: Response) => {
    try {
        console.log("checkAuthSession")
        if (req.session?.member) //agar session mavjud bo'lsa member ni tekshir. Ya'ni: foydalanuvchi login qilganmi? 
            res.send(`<script> alert("${req.session.member.memberNick}")</script>`)
        else res.send(`<script> alert("${Message.NOT_AUTHENTICATED}")</script>`);
    } catch (err) {
        console.log("Error, checkAuthSession:", err)
        res.send(err);
    }
};


//verifyRestaurant
restaurantController.verifyRestaurant = (
    req: AdminRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.session?.member?.memberType === MemberType.RESTAURANT) { //
        req.member = req.session.member;
        next();
    } else {
        const message = Message.NOT_AUTHENTICATED;
        res.send(`<script> alert("${message}"); window.location.replace('/admin/login'); </script>`);
    }
};


export default restaurantController;
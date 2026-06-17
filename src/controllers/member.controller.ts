import { Request, Response } from "express";
import {T} from "../libs/types/comman";
import { MemberType } from "../libs/enums/member.enum";
import MemberService from "../models/Member.service";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import Error from "../libs/Errors"
import Errors from "../libs/Errors";

const memberService = new MemberService();

const memberController: T = {};
//Reactda ishlatiladi
memberController.signup = async (req: Request, res: Response) => {
    try {
        console.log("signup")
        console.log("body:", req.body);
        const input: MemberInput = req.body,
         result: Member = await memberService.signup(input);
        //TODO: Token AUTHENTICATION

      res.json({member: result});
    } catch (err) {
        console.log("Errors, signup:", err);
        if (err instanceof Errors) res.status(err.code).json(err)
        else res .status(Errors.standard.code).json(Errors.standard);

    }
};

memberController.login = async (req: Request, res: Response) => {
    try {
        console.log("login")
        const input: LoginInput = req.body,
         result = await memberService.login(input);
         //TODO: Token AUTHENTICATION
         
        res.json({member: result});
    } catch (err) {
        console.log("Error, login:", err)
         if (err instanceof Error) res.status(err.code).json(err)
        else res .status(Error.standard.code).json(Error.standard);

    }
};


export default memberController;
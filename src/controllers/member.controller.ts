import { json, NextFunction, Request, Response } from "express";
import { T } from "../libs/types/comman";
import { MemberType } from "../libs/enums/member.enum";
import MemberService from "../models/Member.service";
import { ExtendedRequest, LoginInput, Member, MemberInput } from "../libs/types/member";
import Error, { HttpCode, Message } from "../libs/Errors"
import Errors from "../libs/Errors";
import AuthService from "../models/Auth.service";
import { token } from "morgan";
import { AUTH_TIMER } from "../libs/config";

const memberService = new MemberService();
const authService = new AuthService();

const memberController: T = {};
//Reactda ishlatiladi
memberController.signup = async (req: Request, res: Response) => {
    try {
        console.log("signup")
        console.log("body:", req.body);
        const input: MemberInput = req.body,
            result: Member = await memberService.signup(input);
        const token = await authService.createToken(result);

        res.cookie("accessToken", token, { maxAge: AUTH_TIMER * 3600 * 1000, httpOnly: false });

        res.status(HttpCode.CREATED).json({ member: result, accessToken: token });
    } catch (err) {
        console.log("Errors, signup:", err);
        if (err instanceof Errors) res.status(err.code).json(err)
        else res.status(Errors.standard.code).json(Errors.standard);

    }
};

memberController.login = async (req: Request, res: Response) => {
    try {
        console.log("login")
        const input: LoginInput = req.body,
            result = await memberService.login(input);
        const token = await authService.createToken(result);

        res.cookie("accessToken", token, { maxAge: AUTH_TIMER * 3600 * 1000, httpOnly: false });

        res.status(HttpCode.OK).json({ member: result, accessToken: token });
    } catch (err) {
        console.log("Error, login:", err)
        if (err instanceof Error) res.status(err.code).json(err)
        else res.status(Error.standard.code).json(Error.standard);

    }
};


memberController.logout = async (req: ExtendedRequest, res: Response) => {
    try {
        console.log("logout")
        res.cookie("accessToken", "", { maxAge: 0, httpOnly: true });
        res.status(HttpCode.OK).json({ logout: true });
    } catch (err) {
        console.log("Error, logout:", err)
        if (err instanceof Error) res.status(err.code).json(err)
        else res.status(Error.standard.code).json(Error.standard);


    }
}


memberController.getMemberDetail = async (
    req: ExtendedRequest,
    res: Response
) => {
    try {
        console.log("getMemberDetail");
        if (!req.member?._id) throw new Errors(HttpCode.UNAUTHORIZED, (Message as any).Not_AUTHORIZED || 'Not authorized');
        const result = await memberService.getMemberDetail(req.member._id.toString());

        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, getMemberDetail:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};





memberController.verifyAuth = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken;
        if (token) req.member = await authService.checkAuth(token);
        if (!req.member) throw new Errors(HttpCode.UNAUTHORIZED, (Message as any).
            Not_AUTHORIZED || 'Not authorized');

        next();
    } catch (err) {
        console.log("Error, verifyAuth:", err)
        if (err instanceof Errors) res.status(err.code).json(err)
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

memberController.retrieveAuth = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken;
        if (token) req.member = await authService.checkAuth(token);


        // console.log("member:", member)
        next();
    } catch (err) {
        console.log("Error, retrieveAuth:", err)
        if (err instanceof Errors) res.status(err.code).json(err)
        else res.status(Errors.standard.code).json(Errors.standard);
        next();
    }
};

export default memberController;
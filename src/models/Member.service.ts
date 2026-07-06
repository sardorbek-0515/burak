import MemberModel from "../schema/Member.model";
import { LoginInput, Member, MemberInput, MemberUpdateInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import * as bcrypt from "bcryptjs";
import { shapeIntoMongooseObjectId } from "../libs/config";

class MemberService {
    private readonly memberModel;

    constructor() {
        this.memberModel = MemberModel;
    }

    /** SPA */  // React 

    //signu post
    public async signup(input: MemberInput): Promise<Member> {// bu metod yangi foydalanuvchi yaratish uchun ishlatiladi. input parametri foydalanuvchi ma'lumotlarini o'z ichiga oladi va natijada yangi foydalanuvchi obyekti qaytariladi.
        const salt = await bcrypt.genSalt();//bCrypt kutubxonasi yordamida parolni xavfsiz saqlash uchun tuz (salt) yaratadi. Bu tuz parolni xesh qilish jarayonida ishlatiladi va parolni yanada xavfsiz qiladi.
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);//INPUTdagi foydalanuvchi parolini xesh qiladi va uni input obyektiga qayta tayinlaydi. Bu foydalanuvchi parolini ma'lumotlar bazasida xavfsiz saqlash uchun qilinadi.


        try {
            const result = await this.memberModel.create(input);
            result.memberPassword = "";
            return result.toJSON() as Member; //
        } catch (err) {
            console.error("Error, model:signup", err)
            throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);// xatolik shu nickdan, phondan use bolsa
        }
    }


    //login     //Define
    public async login(input: LoginInput): Promise<Member> {
        //TODO: Consider member status later
        const member = await this.memberModel
            .findOne(
                {
                    memberNick: input.memberNick,
                    MemberStatus: { $ne: MemberStatus.DELETE }
                },//memberNick bo'yicha foydalanuvchini topadi
                { memberNick: 1, memberPassword: 1 }
            )
            .exec();
        if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
        else if (member.memberStatus === MemberStatus.BLOCK) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.BLOCKED_USER);
        }

        const isMatch = await bcrypt.compare(
            input.memberPassword,
            member.memberPassword
        );
        if (!isMatch) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);//match bolmasa: wrong
        }

        return await this.memberModel.findById(member._id).lean().exec() as Member;
    }


    public async getMemberDetail(memberId: string): Promise<Member> {
        const targetId = shapeIntoMongooseObjectId(memberId);
        const result = await this.memberModel
            .findOne({ _id: targetId, memberStatus: MemberStatus.ACTIVE })
            .lean()
            .exec();

        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result as Member;
    }

    /** SSR */

    //processSignup
    public async processSignup(input: MemberInput): Promise<Member> {
        const exist = await this.memberModel
            .findOne({ memberType: MemberType.RESTAURANT })
            .exec();
        if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

        const salt = await bcrypt.genSalt(); //bCrypt kutubxonasi yordamida parolni xavfsiz saqlash uchun tuz (salt) yaratadi. Bu tuz parolni xesh qilish jarayonida ishlatiladi va parolni yanada xavfsiz qiladi.
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

        try {
            const result = await this.memberModel.create(input);
            return result as unknown as Member;
        } catch (err) {
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }


    //processLogin
    public async processLogin(input: LoginInput): Promise<Member> {
        const member = await this.memberModel
            .findOne(
                { memberNick: input.memberNick },
                { memberNick: 1, memberPassword: 1, memberStatus: 1 }
            )
            .exec();
        if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
        else if (member.memberStatus === MemberStatus.BLOCK) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.BLOCKED_USER);
        }

        const isMatch = await bcrypt.compare(
            input.memberPassword,
            member.memberPassword
        );
        if (!isMatch) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
        }

        return await this.memberModel.findById(member._id).exec() as Member;
    }

    //getUsers  /adminka memberlarni malumotini ozgartirish 
    // define, traktor yasash
    public async getUsers(): Promise<Member[]> {
        const result = await this.memberModel
            .find({ memberType: MemberType.USER })//member type qiymati user bolganini izla/ find-> filter
            ///users → bu massiv bo‘ladi.Ichida memberType = USER bo‘lgan barcha hujjatlar ro‘yxat ko‘rinishida saqlanadi.
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result as unknown as Member[];

    }


    //updateChosenUser adminka memberlarni malumotini ozgartirish
    public async updateChosenUser(input: MemberUpdateInput): Promise<Member> {
        input._id = shapeIntoMongooseObjectId(input._id);
        const result = await this.memberModel
            .findByIdAndUpdate({ _id: input._id }, input, { new: true })
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

        return result as unknown as Member;

    }
    public checkAuth({ memberStatus }: { memberStatus?: MemberStatus }): boolean {
        return memberStatus !== MemberStatus.BLOCK;
    }
}


export default MemberService;
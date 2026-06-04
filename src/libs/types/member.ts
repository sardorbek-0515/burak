import { MemberStatus, MemberType } from "../enums/member.enum";

export interface Member {
    memberType: MemberType;
    memberStatus: MemberStatus;
    memberNick: string;
    memberPhone: string;
    memberPassword?: string;
    memberAddress?: string;
    memberdesc?: string;
    memberImage?: string;
    memberPoints: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface MemberInput {
    memberType?: MemberType;
    memberStatus?: MemberStatus;
    memberNick: string;
    memberPhone: string;
    memberPassword: string;
    memberAddress?: string;
    memberdesc?: string;
    memberImage?: string;
    memberPoints?: number;
}


// objectning key qismini string qilinsa json form bo'larkan..
export interface LoginInput {
    memberNick: string;
    memberPassword: string;
}
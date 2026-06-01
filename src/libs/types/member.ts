import { MemberStatus, MemberType } from "../enums/member.enum";
import { ObjectId } from "mongoose";
// import { ObjectId } from "mongoose"


export interface Member {
  _id: ObjectId;
  memberType: string;
  memberStatus: string;
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  memberPoints: number;
  memberAdress?: string;
  memberDesc?: string;
  memberImage?: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface MemberInput {
    memberType?:MemberType;
    memberStatus?: MemberStatus;
    memberNick: string;
    memberPhone: string;
    memberPassword: string;
    memberAdress?: string;
    memberDesc?: string;
    memberImage?: string;
    memberPoints?: number;
}
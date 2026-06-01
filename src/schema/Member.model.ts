import mongoose, {Schema} from "mongoose";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
// Schemani 2 xil usulda qurish mumkin
// 1-Schema uzidan    2- code first , code based usuli va biz 2-dan foydalanamiz

// ENUM-- aniq belgilangan qiymatlarnigina qabul qilish un ishlatiladigan type hissoblanadi

 const memberSchema = new Schema ({   // memberschema object

memberType: {
type: String,
enum: MemberType,
default: MemberType.USER
},

memberStatus: {
    type: String,
    enum: MemberStatus,
    default: MemberStatus.ACTIVE
    
},

memberNick: {
    type: String,
    index: {unique: true, sparse: true},
    required: true

},

memberPhone: {
    type: String,
    index: { unique: true, sparse: true},
    required: true
},

memberPassword: {
    type: String,
    select: false,
    required: true
},

memberAdress: {
    type: String,
},

memberDesc: {
    type: String,
},

memberImage: {
    type: String,
},

memberPoints: {
    type: Number,
    default: 0,
 },
}, {timestamps: true}   // qachon updatedAt, createdAtni aytadi
);

export default mongoose.model("Member", memberSchema)
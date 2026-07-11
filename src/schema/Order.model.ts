import mongoose, { Schema } from "mongoose";
import { OrderStatus } from "../libs/enums/order.enum";

const orderSchema = new Schema({
    orderTotal: {
        type: Number,
        required: true //required bolishi shart
    },

    orderDelivery: {
        type: Number,
        required: true
    },

    orferStatus: {
        type: String,
        enum: OrderStatus,
        dafault: OrderStatus.PAUSE
    },

    memberId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Member",  //member.SChemani Member deb olganmiz

    }
},
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema)
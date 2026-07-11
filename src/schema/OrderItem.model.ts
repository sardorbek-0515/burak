import mongoose, { Schema } from "mongoose";

const orederItemSchema = new Schema(
    {
        itemQuantity: {
            type: Number,
            required: true,
        },

        itemPrice: {
            type: Number,
            required: true,
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",// ref productSchemaga qaratilgan
        },
    },
    { timestamps: true, collection: "orderItems" }, //mogodb da orderItems shu nom bn hosil qiladi
);

export default mongoose.model("OrderItem", orederItemSchema);
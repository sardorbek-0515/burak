import OrderItemModel from "../schema/OrderItem.model";
import OrderModel from "../schema/Order.model";
import { Member } from "../libs/types/member";
import {
    Order,
    OrderInquiry,
    OrderItemInput,
    OrderUpdateInput,
} from "../libs/types/order";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { ObjectId } from "mongoose";
import { OrderStatus } from "../libs/enums/order.enum";
import MemberService from "./Member.service";

class OrderService {
    private readonly orderModel;
    private readonly orderItemModel;
    private readonly memberService;

    constructor() {
        this.orderModel = OrderModel;
        this.orderItemModel = OrderItemModel;
        this.memberService = new MemberService();
    }

    public async createOrder(
        member: Member,
        input: OrderItemInput[],
    ): Promise<Order> {
        // console.log("input:", input);
        const memberId = shapeIntoMongooseObjectId(member._id);
        const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
            return accumulator + item.itemPrice * item.itemQuantity;
        }, 0);
        const delivery = amount < 100 ? 5 : 0;
        // console.log("values:", amount, delivery);

        try {
            const newOrder = await this.orderModel.create({
                orderTotal: amount + delivery,
                orderDelivery: delivery,
                memberId: memberId,
            });

            const orderId = newOrder._id as unknown as ObjectId;
            console.log("orderId:", newOrder._id);
            await this.recordOrderItem(orderId, input);

            // TODO: create order items
            return newOrder as unknown as Order;
        } catch (err) {
            console.log("Error, model:createOrderL:", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }
    private async recordOrderItem(
        orderId: ObjectId,
        input: OrderItemInput[],
    ): Promise<void> {
        const promisedList = input.map(async (item: OrderItemInput) => {
            item.orderId = orderId;
            item.productId = shapeIntoMongooseObjectId(item.productId);
            await this.orderItemModel.create(item);
            return "INSERTED"; // hammasi ishga tushsa jonatadi
        });

        // console.log("promisedList:", promisedList);
        const orderItemsState = await Promise.all(promisedList);
        console.log("orderItemsState:", orderItemsState);
    }


}

export default OrderService;
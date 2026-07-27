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
        member: Member, //kim yubordi
        input: OrderItemInput[],//savatchadagi mahsulotlar. Frontend yuborgan mahsulotlar.
    ): Promise<Order> {
        console.log("input:", input); //kelgan mahsulotlarni tekshirish
        const memberId = shapeIntoMongooseObjectId(member._id);//member id ni ObjectId ga o'tkazish
        const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
            return accumulator + item.itemPrice * item.itemQuantity;// jami narxni hisoblash
        }, 0);
        // Masalan:
        // Lavash 9$ x2 = 18$
        // Cola   2$ x1 = 2$
        // amount = 20$

        const delivery = amount < 100 ? 5 : 0;//100$ dan kam bo'lsa(0)aks holda 5$ dastafka
        // console.log("values:", amount, delivery);

        try {
            const newOrder = await this.orderModel.create({
                orderTotal: amount + delivery,//umumiy summa
                orderDelivery: delivery,//yetkazib berish narxi
                memberId: memberId, //yaratilgan order id
            }); //Orders collectionga yozadi.

            //yangi id hosil qilinidi
            const orderId = newOrder._id as unknown as ObjectId; //yangi order id sini oladi
            console.log("orderId:", newOrder._id); // yaratilgan order id
            await this.recordOrderItem(orderId, input);// mahsulotlarni orderItem ga yozadi

            // TODO: create order items
            return newOrder as unknown as Order;  // yaratilgan orderni qaytaradi
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
            item.orderId = orderId; //order id ni qo'shadi
            item.productId = shapeIntoMongooseObjectId(item.productId);// product id ni ObjectId ga o'tkazadi

            await this.orderItemModel.create(item);//databasega yozadi.  orderItems
            return "INSERTED"; // hammasi ishga tushsa jonatadi
        });

        console.log("promisedList:", promisedList);  // Promise larni chiqaradi
        const orderItemsState = await Promise.all(promisedList); // hamma yozilish tugashini kutadi
        // console.log("orderItemsState:", orderItemsState);// natijani chiqaradi
    }

    /** =================== getMyOrders =================== */
    public async getMyOrders(
        member: Member, // qaysi foydalanuvchining buyurtmalari
        inquiry: OrderInquiry, // filter va pagination
    ): Promise<Order[]> {

        const memberId = shapeIntoMongooseObjectId(member._id); // member id ni ObjectId qiladi

        const matches = {
            memberId: memberId,
            orderStatus: inquiry.orderStatus,
        }; // qidirish sharti

        const result = await this.orderModel
            .aggregate([
                { $match: matches }, // shu foydalanuvchining orderlarini topadi

                { $sort: { updateAt: -1 } }, // oxirgi yangilangani tepada chiqadi

                { $skip: (inquiry.page - 1) * inquiry.limit }, // nechta tashlab o'tishni hisoblaydi

                { $limit: inquiry.limit }, // nechta order qaytarishini belgilaydi

                {
                    $lookup: {
                        from: "orderItems", //Qaysi collectionga borishni aytyapti.
                        localField: "_id",//Orders ichidagi qaysi field.
                        foreignField: "orderId",// OrderItems ichidagi orderId
                        as: "orderItems", //qaysi nom bilan qo'shishni aytyapti.
                    },
                }, // order ichidagi mahsulotlarni olib keladi Order ichiga OrderItemlarni qo'shadi.

                {
                    $lookup: {
                        from: "products",
                        localField: "orderItems.productId",
                        foreignField: "_id",
                        as: "productData",
                    },
                }, //OrderItem ichidagi productId orqali Product ma'lumotlarini ham olib keladi.
            ])
            .exec();

        if (!result)
            throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND); // topilmasa xato

        return result as unknown as Order[]; // orderlarni qaytaradi
    }

    public async updateOrder(
        member: Member, // order egasi
        input: OrderUpdateInput, // frontend yuborgan yangi status
    ): Promise<Order> {

        const memberId = shapeIntoMongooseObjectId(member._id), // member id ni ObjectId qiladi
            orderId = shapeIntoMongooseObjectId(input.orderId), // order id ni ObjectId qiladi
            orderStatus = input.orderStatus; // yangi statusni oladi

        const result = await this.orderModel
            .findOneAndUpdate( //2ta argumnet pass qilinadi ozgaruvchi
                {
                    memberId: memberId, // shu memberning orderini topadi     1
                    _id: orderId, // shu orderni topadi
                },
                {
                    orderStatus: orderStatus, // statusni yangilaydi2
                },
                {
                    new: true, // yangilangan hujjatni qaytaradi
                },
            )
            .exec();

        if (!result)
            throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED); // topilmasa xato

        // agar status PROCESS bo'lsa foydalanuvchiga 1 ball beradi
        if (orderStatus === OrderStatus.PROCESS) {
            await this.memberService.addUserPoint(member, 1); // tolov qilganda user point 1 ga oshadi
        }

        return result as unknown as Order; // yangilangan orderni qaytaradi
    }
}

export default OrderService;
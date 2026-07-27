import { ExtendedRequest } from "../libs/types/member";
import { T } from "../libs/types/comman";
import { Response } from "express";
import Errors, { HttpCode } from "../libs/Errors";
import OrderService from "../models/Order.service";
import { OrderInquiry, OrderUpdateInput } from "../libs/types/order";
import { OrderStatus } from "../libs/enums/order.enum";

const orderService = new OrderService(); //controllerlar har doim object orqali

const orderController: T = {};
/** =================== createOrder =================== */
orderController.createOrder = async (req: ExtendedRequest, res: Response) => {
    try {
        console.log("createOrder");
        const result = await orderService.createOrder(req.member, req.body);
        res.status(HttpCode.CREATED).json({ result });
    } catch (err) {
        console.log("Error, createOrder:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};
/** =================== getMyOrders =================== */
orderController.getMyOrders = async (req: ExtendedRequest, res: Response) => {
    try {
        console.log("getMyOrders"); // method ishlaganini tekshiradi

        const { page, limit, orderStatus } = req.query; // frontend yuborgan querylarni oladi

        console.log("req.query:", req.query); // querylarni terminalga chiqaradi

        const inquiry: OrderInquiry = {
            page: Number(page), // page ni numberga o'tkazadi
            limit: Number(limit), // limit ni numberga o'tkazadi
            orderStatus: orderStatus as OrderStatus, // statusni OrderStatus typeiga o'tkazadi
        };

        console.log("inquiry:", inquiry); // tayyor bo'lgan inquiry objectini chiqaradi

        const result = await orderService.getMyOrders(req.member, inquiry); // serviceni chaqirib orderlarni oladi

        res.status(HttpCode.CREATED).json(result); // frontendga orderlarni qaytaradi

    } catch (err) {
        console.log("Error, getMyOrders:", err); // xatoni chiqaradi

        if (err instanceof Errors)
            res.status(err.code).json(err); // custom error bo'lsa qaytaradi
        else
            res.status(Errors.standard.code).json(Errors.standard); // oddiy xato bo'lsa standard error qaytaradi
    }
};
/** =================== updateOrder =================== */
orderController.updateOrder = async (req: ExtendedRequest, res: Response) => {
    try {
        console.log("updateOrder"); // method ishlaganini tekshiradi

        const input: OrderUpdateInput = req.body; // frontend yuborgan ma'lumotni oladi

        const result = await orderService.updateOrder(req.member, input); // serviceni chaqiradi

        console.log("input:", input); // kelgan ma'lumotni chiqaradi

        res.status(HttpCode.CREATED).json(result); // yangilangan orderni frontendga yuboradi

    } catch (err) {
        console.log("Error, updateOrder:", err); // xatoni chiqaradi

        if (err instanceof Errors)
            res.status(err.code).json(err); // custom error bo'lsa
        else
            res.status(Errors.standard.code).json(Errors.standard); // oddiy error bo'lsa
    }
};
export default orderController;
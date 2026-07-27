import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/comman";
import ProductServer from "../models/Product.service";
import { ProductInput, ProductInquiry } from "../libs/types/product";
import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import { ProductCollection } from "../libs/enums/product.enum";



const productService = new ProductServer
//const vazifasi: ProductServer tipidagi yangi obyekt yaratadi va uni productService ga saqlaydi. Bu obyekt ProductServer klassining metodlarini ishlatish uchun kerak bo'ladi.

//getAllProducts
const productController: T = {}; //bosh object yaratadi






/**  SPA */


productController.getProducts = async (req: Request, res: Response) => {
    try {
        console.log("getProducts")
        const { page, limit, order, productCollection, search } = req.query
        const inquiry: ProductInquiry = {
            order: String(order),
            page: Number(page) as unknown as ProductInquiry["page"],
            limit: Number(limit) as unknown as ProductInquiry["limit"],
        } as ProductInquiry;
        if (productCollection) {
            inquiry.productCollection = productCollection as ProductCollection
        }
        if (search) inquiry.search = String(search);

        const result = await productService.getProducts(inquiry as any);

        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, getProducts:", err);
        if (err instanceof Errors) res.status(err.code).json(err)
        else res.status(Errors.standard.code).json(Errors.standard);
    }
}

productController.getProduct = async (req: ExtendedRequest, res: Response) => {
    try {
        console.log("getProduct");
        const { id } = req.params;
        console.log("req.member:", req.member)
        const memberId = (req.member?._id ?? null) as any,
            result = await productService.getProduct(memberId, Array.isArray(id) ? id[0] : id);

        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, getProduct:", err);
        if (err instanceof Errors) {
            res.status(err.code).json(err);
        } else {
            res.status(Errors.standard.code).json(Errors.standard);
        }
    }
};










/**  SRR */
//adminka loyhasi uchun

////////////////////////////getAllProducts////////////////////////////
//Define
productController.getAllProducts = async (req: Request, res: Response) => {
    try {
        console.log("getAllProducts")//console.log(req.body) // formadan kelgan datani ko'rsatadi
        const data = await productService.getAllProducts()
        res.render("products", { products: data })
        //bu products.ejs fayliga products nomi bilan data uzatyapti
    } catch (err) {
        console.log("Error, getAllProducts:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);//agar err Errors tipida bo'lmasa, standart xatolikni yuboradi

    }
};

//////////////////////////  createNewProduct ///////////
productController.createNewProduct = async (
    req: AdminRequest,
    res: Response
) => {
    try {
        console.log("createNewProduct")
        // console.log("req.body:", req.body) // formadan kelgan datani ko'rsatadi
        if (!req.files?.length) //bu array length 0dan kotta bolishi kerak
            throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

        const data: ProductInput = req.body;
        data.productImages = req.files?.map(ele => {
            return ele.path.replace(/\\/g, "/");
        });

        await productService.createNewProduct(data)
        console.log("data", data)
        res.send(`<script> alert("Sucessful creation!"); window.location.replace('/admin/product/all') </script>`);
    } catch (err) {
        console.log("Error, createNewProduct:", err);
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG; //agar err Errors tipida bo'lsa, err.message bilan xatolikni oladi, aks holda standart xatolikni oladi
        res.send(`<script> alert("${message}"); window.location.replace('/admin/product/all') </script>`);

    }
};

//////////////////////////  update    ///////////////////////////
productController.updateChosenProduct = async (req: Request, res: Response) => {
    try {
        console.log("updateChosenProduct")
        const id = req.params.id as string


        const result = await productService.updateChosenProduct(id, req.body)

        res.status(HttpCode.OK).json({ data: result });
    } catch (err) {
        console.log("Error, updateChosenProduct:", err);
        if (err instanceof Errors) res.status(err.code).json(err)
        else res.status(Errors.standard.code).json(Errors.standard);

    }
};

export default productController;


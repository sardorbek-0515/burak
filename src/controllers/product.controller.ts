import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/comman";
import ProductServer from "../models/Product.service";
import { ProductInput } from "../libs/types/product";
import { AdminRequest } from "../libs/types/member";


const productService = new ProductServer

//getAllProducts
const productController: T = {};
/**  SPA */

/**  SRR */
//adminka loyhasi uchun
//getAllProducts
productController.getAllProducts = async (req: Request, res: Response) => {
    try {
        console.log("getAllProducts")
        res.render("products");
    } catch (err) {
        console.log("Error, getAllProducts:", err);
        if (err instanceof Errors) res.status(err.code).json(err)
        else res .status(Errors.standard.code).json(Errors.standard);

    }
};

//createNewProduct
productController.createNewProduct = async (
    req: AdminRequest, 
    res: Response
) => {
    try {
        console.log("createNewProduct")
        if(!req.files?.length) //bu array length 0dan kotta bolishi kerak
         throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED );
 
        const data: ProductInput = req.body;
        data.productImages = req.files?.map(ele => {
            return ele.path.replace(/\\/g, "/");
        });

        await productService.createNewProduct(data)
            console.log("data", data)  
        res.send(`<script> alert("Sucessful creation!"); window.location.replace('/admin/product/all') </script>`);
    } catch (err) {
        console.log("Error, createNewProduct:", err);
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
       res.send(`<script> alert("${message}"); window.location.replace('/admin/product/all') </script>`);

    }
};

//update
productController.updateChosenProduct = async (req: Request, res: Response) => {
    try {
      console.log("updateChosenProduct")
     const id = req.params.id as string
    
      
      const result = await productService.updateChosenProduct(id, req.body)

      res.status(HttpCode.OK).json({ data: result });
    } catch (err) {
        console.log("Error, updateChosenProduct:", err);
        if (err instanceof Errors) res.status(err.code).json(err)
        else res .status(Errors.standard.code).json(Errors.standard);

    }
};

export default productController;

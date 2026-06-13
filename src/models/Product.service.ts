import { stringify } from "node:querystring";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { Product, ProductInput } from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { shapeIntoMongooseObjectId } from "../libs/config";

class ProductServer {
  private readonly productModel;

  constructor() {
    this.productModel = ProductModel;
  } 

  /**  SPA */

  /**  SRR */

  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      return await this.productModel.create(input) as unknown as Product;
    } catch (err) {
      console.error("Error, model:createNewProduct:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

 // ✅ To'g'ri
public async updateChosenProduct(
    id: string,
    input: ProductInput
): Promise<Product> {
    const objId = shapeIntoMongooseObjectId(id);  // yangi o'zgaruvchi
    const result = await this.productModel.findOneAndUpdate(
        { _id: objId },   // objId ishlatiladi
        input, 
        { new: true }
    ).exec();
    if(!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    
    return result as unknown as Product;
}
}

export default ProductServer;

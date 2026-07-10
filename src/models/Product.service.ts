import { stringify } from "node:querystring";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { Product, ProductInput, ProductInquiry } from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { ProductStatus } from "../libs/enums/product.enum";
import { match } from "node:assert/strict";
import { T } from "../libs/types/comman";
import { ObjectId } from "mongoose"

class ProductServer {
  private readonly productModel;

  constructor() {
    this.productModel = ProductModel;
  }

  ///////////////////////**  SPA *///////////////////////

  ///////// getProducts /////////// Haridorlar loyhasi
  public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
    const match: T = { productStatus: ProductStatus.PROCESS };
    //match processda bolgan productlarni olib beryabdi Pause olmaydi

    if (inquiry.productCollection)
      match.productCollection = inquiry.productCollection;
    if (inquiry.search) (
      match.productName = { $regex: new RegExp(inquiry.search, "i") }
    )

    const sort: T =
      inquiry.order === "productPrice" //inquiry.order ni valuesiga qarab pas/tepa,tepa/pasga degan inquary hosil qildik/ eng arzondan yuqoriga qarab
        ? { [inquiry.order]: 1 } //eng arzonda yuqoruiga qarab
        : { [inquiry.order]: -1 };// : ixtiyoriyda yuqoridan pasga

    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquiry.page * 1 - 1) * inquiry.limit }, // 3 x 1,2,3
        //nechtadir malumot otkazish ignor, HECH QANDAY MALUMOTNI SKIP QILMA, boshidan olib ber degani
        { $limit: inquiry.limit * 1 },// 3 => 4,5,6
        //bizga boshidan aynan nechta malumot kerak
      ])
    //skip  &limit pagenation hosil qiladi
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result as unknown as Product[];
  }

  public async getProduct(memberId: ObjectId | null,
    id: string
  ): Promise<Product> {
    const productId = shapeIntoMongooseObjectId(id);

    let result = await this.productModel.findOne({
      _id: productId,
      productStatus: ProductStatus.PROCESS
    })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    //TODO: If authenticated user => first => view log creation

    return result as unknown as Product;
  }






































  ////////////////////////////////////**  SRR *////////////////////////////

  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      return await this.productModel.create(input) as unknown as Product;
    } catch (err) {
      console.error("Error, model:createNewProduct:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }


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
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result as unknown as Product;
  }
}

export default ProductServer;

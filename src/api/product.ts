import {axios, AxiosResponseData} from '../utils/request'
import {NEWPRODUCT_MODULE} from './_prefix'
import {Comment} from "./comment.ts";

export interface Product {
    productId?: number
    productName?: string
    productOriginalPrice?: number
    productNowPrice?: number
    productCover?: string
    productDescription?: string
    productScore?: number
    productScoreCount?: number // 评分人数
    productCommentList?: Comment[],
}

export const getAttributesByCategory = (category: string) => {
    return axios.get(`${NEWPRODUCT_MODULE}/getAttributesByCategory/${category}`)
        .then(res => {
            return res.data.result;
        })
}

export const filterProducts = (category: string, filters: Record<string, string>) => {
    //不一定对！！！！！！！！！
    const queryString = new URLSearchParams(filters).toString(); // 将 filters 转换为查询字符串
    return axios.get(`${NEWPRODUCT_MODULE}/filterProducts/${category}?${queryString}`)
        .then(res => {
            return res.data.result; // 返回结果中的 `result` 字段
        })
}

// 可以使用async/await
// 假如后端返回的数据类型是Product
// 这里的返回类型就可以写成Promise<AxiosResponseData<Product>>
export async function getProductById(productId: number): Promise<AxiosResponseData<Product>> {
    return await axios.get(`${NEWPRODUCT_MODULE}/getProductById/${productId}`)
}

export function formatPrice(price: number) {
    return "￥" + price.toFixed(2)
}

export const mockProduct: Product = {
    productId: 1,
    productName: 'Apple MacBook Pro',
    productOriginalPrice: 1299,
    productNowPrice: 1099,
    productCover: 'src/assets/iphoeAndEarpod.jpg',
    productDescription: 'Apple M1芯片，8核CPU，8核GPU，16核神经引擎，8GB内存，' +
        '256GB固态硬盘，13.3英寸Retina显示屏，背光Magic Keyboard，触控栏，触控ID，' +
        '四个雷电3端口，最长',
    productScore: 4.4,
    productScoreCount: 157
}

export const categoryNameMap: Map<string, string> = new Map()
categoryNameMap.set("FOOD", "食品")
categoryNameMap.set("APPAREL", "服装")
categoryNameMap.set("ELECTRONICS", "电子产品")
categoryNameMap.set("PET_SUPPLIES", "宠物用品")
categoryNameMap.set("HEALTH_PRODUCTS", "保健品")
categoryNameMap.set("BATH_PRODUCTS", "洗浴用品")

// 分类属性
export const productAttributes = [
    "品牌",
    "产地",
    "规格",
    "颜色",
    "价格",
    "用途",
    "价格",
    "品牌",
]

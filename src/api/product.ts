import {AxiosResponseData} from '../utils/request'
import {NEWPRODUCT_MODULE} from './_prefix'
import {Comment} from "./comment.ts";
import axios from "axios";


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

export interface ProductAttribute {
    productAttributeId?: number;
    productAttributeName?: string; // 属性名，如食品的口味 flavor，服饰的季节 season
    displayName?: string; // 显示名，如"口味", "季节"
    productCategory?: string; // 所属类别, 属于食品还是服饰
}

export const productService = axios.create({
    baseURL: 'http://localhost:8080/api/newProducts',
    timeout: 30000,
});

export async function getAttributesByCategory(category: string): Promise<AxiosResponseData<ProductAttribute[]>> {
    return await productService.get(`/getAttributesByCategory/${category}`)
        .then(res => {
            return res.data.result
        })
}

export async function filterProducts(category: string, filters: Record<string, string>): Promise<AxiosResponseData<Product>> {
    const queryString = new URLSearchParams(filters).toString();
    return await productService.get(`/filterProducts/${category}?${queryString}`)
        .then(res => {
            return res.data.result;
        })
}


// 可以使用async/await
// 假如后端返回的数据类型是Product
// 这里的返回类型就可以写成Promise<AxiosResponseData<Product>>
export async function getProductById(productId: number): Promise<AxiosResponseData<Product>> {
    return await axios.get(`${NEWPRODUCT_MODULE}/getProductById/${productId}`)
}

export interface ProductOption {
    productOptionId?: number;
    productId?: number;
    productOptionName?: string; // 选项名，如"颜色"
}

export interface ProductOptionValue {
    productOptionValueId?: number;
    productId?: number;
    productOptionName?: string;
    value?: string; // 选项值，如"银色"
}

export async function getProductOptions(productId: number): Promise<AxiosResponseData<ProductOption[]>> {
    return await productService.get(`/getProductOptions/${productId}`)
}

export async function getProductOptionValues(productId: number): Promise<AxiosResponseData<ProductOptionValue[]>> {
    return await productService.get(`/getProductOptionValues/${productId}`)
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
export const mockOptionColor: ProductOption = {
    productOptionName: '颜色',
}

export const mockOptionSize: ProductOption = {
    productOptionName: '规格',
}

export const mockOptionValue1: ProductOptionValue = {
    productOptionName: '颜色',
    value: '银色',
}

export const mockOptionValue2: ProductOptionValue = {
    productOptionName: '颜色',
    value: '黑色',
}

export const mockOptionValue3: ProductOptionValue = {
    productOptionName: '颜色',
    value: '金色',
}

export const mockOptionValue4: ProductOptionValue = {
    productOptionName: '规格',
    value: '内存8G 硬盘256G',
}

export const mockOptionValue5: ProductOptionValue = {
    productOptionName: '规格',
    value: '内存16G 硬盘512G',
}

export const mockOptionMap: Map<string, ProductOptionValue[]> = new Map()
mockOptionMap.set("颜色", [mockOptionValue1, mockOptionValue2, mockOptionValue3])
mockOptionMap.set("规格", [mockOptionValue4, mockOptionValue5])

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

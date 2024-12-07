import {axios, AxiosResponseData} from '../utils/request'
import {NEWPRODUCT_MODULE} from './_prefix'

export interface Product {
    productId: number
    productName: string
    productPrice: number
    productCover: string
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

export const mockProductList: Product[] = new Array(10).fill({
    productId: 1,
    productName: 'Apple MacBook Pro',
    productPrice: 1299,
    productCover: 'https://bpic.588ku.com/element_origin_min_pic/19/04/09/01ef1cda82f8366435db20bd4e7b7acc.jpg',
})

// 可以使用async/await
// 假如后端返回的数据类型是Product
// 这里的返回类型就可以写成Promise<AxiosResponseData<Product>>
export async function getProductById(productId: number): Promise<AxiosResponseData<Product>> {
    return await axios.get(`${NEWPRODUCT_MODULE}/getProductById/${productId}`)
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

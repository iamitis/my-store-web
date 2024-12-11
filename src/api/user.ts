import {mockProduct, Product} from "./product.ts";
import {AxiosResponseData} from "../utils/request.ts";
import axios from "axios";

export interface User {
    userId?: number,
    userName?: string,
    userIdentity?: UserIdentity,
    userEmail?: string,
    userPassword?: string,
}

export enum UserIdentity {
    PARENT = 'PARENT',
    CHILD = 'CHILD',
}

export const userService = axios.create({
    baseURL: 'http://localhost:8080/users',
    timeout: 30000,
});

export const userPageTitleMap: Map<string, string> = new Map()
userPageTitleMap.set('Overview', '我的账号')
userPageTitleMap.set('Order', '我的订单')
userPageTitleMap.set('ShoppingCart', '我的购物车')
userPageTitleMap.set('Notification', '我的消息')

export interface CartItem {
    cartItemId?: number,
    userId?: number,
    product?: Product,
    quantity?: number,
    date?: Date,
}

export async function getShoppingCart(userId: number): Promise<AxiosResponseData<CartItem[]>> {
    return await userService.get(`/getShoppingCart/${userId}`)
}

export async function addToShoppingCart(userId: number, product: Product, quantity: number): Promise<AxiosResponseData<CartItem>> {
    const data: CartItem = {
        userId: userId,
        product: product,
        quantity: quantity,
        date: new Date()
    }
    return await userService.post(`/addToShoppingCart`, data)
}

export const mockCartItem: CartItem = {
    cartItemId: 1,
    userId: 1,
    product: mockProduct,
    quantity: 1,
    date: new Date()
}

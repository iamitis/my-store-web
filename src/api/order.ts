import {CartItem, mockCartItem, userService} from "./user.ts";
import axios from "axios";
import {AxiosResponseData} from "../utils/request.ts";

export interface Order {
    orderId?: number,
    userId?: number,
    products?: CartItem[],
    addressInfoId?: number,
    orderStatus?: OrderStatus,
    totalPrice?: number,
    createDate?: Date,
}

export enum OrderStatus {
    UNPAID = 'UNPAID',
    UNSEND = 'UNSEND',
    UNGET = 'UNGET',
    UNCOMMENT = 'UNCOMMENT',
    DONE = 'DONE',
}

export const orderService = axios.create({
    baseURL: 'http://localhost:8080/api/orders',
    timeout: 30000,
});


export async function getAllOrders(userId: number):Promise<AxiosResponseData<Order[]>> {
    return await userService.get(`/getAllOrders/${userId}`);
}

export async function createOrder(userId: number, productList: CartItem[], addressInfoId: number):Promise<AxiosResponseData<boolean>> {
    const order : Order = {
        userId: userId,
        products: productList,
        addressInfoId: addressInfoId,
        orderStatus: OrderStatus.UNSEND,
        createDate : new Date()
    }
    return await userService.post(`/createOrder`, order);
}

export const mockOrder: Order = {
    orderId: 1,
    userId: 1,
    products: [mockCartItem, mockCartItem],
    addressInfoId: 1,
    orderStatus: OrderStatus.UNSEND,
    totalPrice: 100000,
    createDate : new Date()
}
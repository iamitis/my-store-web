import {mockProduct, Product} from "./product.ts";
import {AxiosResponseData} from "../utils/request.ts";
import axios from "axios";

export interface Order {
    orderId?: number,
    userId?: number,
    product?: Product,
    quantity?: number,
}

export const orderService = axios.create({
    baseURL: 'http://localhost:8080/orders',
    timeout: 30000,
});

export const mockOrder: Order = {
    orderId: 1,
    userId: 1,
    product: mockProduct,
    quantity: 1,
}
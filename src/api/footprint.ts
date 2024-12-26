import {mockProduct, Product} from "./product.ts";
import {AxiosResponseData} from "../utils/request.ts";
import axios from "axios";

export const footprintService = axios.create({
    baseURL: 'http://localhost:8080/api/footprints',
    timeout: 30000,
});

export interface Footprint {
    footprintId?: number,
    userId: number,
    productList: Product[],
    footprintDate: Date,
    footprintDateStr?: string,
}

export const mockFootprint: Footprint = {
    userId: 1,
    productList: new Array(15).fill(mockProduct),
    footprintDate: new Date(),
}

export async function getFootprintByUserId(userId: number): Promise<AxiosResponseData<Footprint[]>> {
    return await footprintService.get(`/getFootprintByUserId/${userId}`)
}

export async function addFootprint(userId: number, productId: number, dateStr: string): Promise<AxiosResponseData<Footprint>> {
    return await footprintService.get(`/addFootprint/${userId}/${productId}/${dateStr}`)
}
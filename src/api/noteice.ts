import axios from "axios";
import {AxiosResponseData} from "../utils/request.ts";

export interface Notice{
    noticeId?:number,
    noticeSource?:NoticeSource,
    userId?:number,
    title?:string,
    content?:string,
    createTime?:Date,
    noticeStatus?:NoticeStatus,
}

export enum NoticeSource{
    ORDER_STATUS = "ORDER_STATUS",
    CONSUME_MESSAGE = "CONSUME_MESSAGE",
    DISCOUNT_MESSAGE = "DISCOUNT_MESSAGE",
    PARENT_MESSAGE = "PARENT_MESSAGE",
}

export enum NoticeStatus{
    UNREAD = "UNREAD",
    READ = "READ",
}

export const orderService = axios.create({
    baseURL: 'http://localhost:8080/api/notice',
    timeout: 30000,
});

export async function readNotice(noticeId: number):Promise<AxiosResponseData<boolean>> {
    return await orderService.post(`/readNotice/${noticeId}`)
        .then(res=>{
            return res;
        })
}

export async function createNotice(notice:Notice):Promise<AxiosResponseData<boolean>> {
    return await orderService.post(`/createNotice`, notice,
        {headers: {'Content-Type': 'application/json'}})
        .then(res=>{
            return res;
        })
}

export async function getNoticeByUserId(userId: number):Promise<AxiosResponseData<Notice[]>> {
    return await orderService.get(`/getNotice/${userId}`)
}
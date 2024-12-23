import axios from "axios";
import {AxiosResponseData} from "../utils/request.ts";
import {currUser} from "../main.ts"
import {ref} from "vue";
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

export const isUnreadNotice = ref<boolean>(false);

export async function isHaveUnreadNotice(){
    if(currUser.id === -1){
        return;
    }
    const res = await isThereUnreadNotice(currUser.id!);
    if(res.data.code!=='000'){
        ElMessage.error('获取用户通知失败' + res.data.msg);
    }else{
        isUnreadNotice.value = res.data.result;
    }
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

export async function getUnreadNotice(userId: number):Promise<AxiosResponseData<Notice[]>> {
    return await orderService.get(`/getUnreadNotice/${userId}`)
}

export async function isThereUnreadNotice(userId: number):Promise<AxiosResponseData<boolean>> {
    return await orderService.get(`/isThereUnreadNotice/${userId}`)
}
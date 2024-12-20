export interface Notice{
    noticeId?:number,
    noticeSource?:NoticeSource,
    userId?:number,
    title?:string,
    content?:string,
    createDate?:Date,
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
    DONE = "DONE",
}
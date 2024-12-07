import {axios} from '../utils/request'
import {NEWPRODUCT_MODULE} from './_prefix'


export const getAttributesByCategory = (category: string) => {
    return axios.get(`${NEWPRODUCT_MODULE}/getAttributesByCategory/${category}`)
        .then(res=>{
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

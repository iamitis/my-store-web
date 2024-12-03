import axios, {AxiosResponse} from 'axios'

//创建一个axios的实例service
const service = axios.create()

/**
 * 后端返回的数据格式，是 http.response.data 的内容<br>
 * 解释：后端给返回的数据又封装了一层，注意这里的`code`和http的状态码不同<br>
 * 只有当http的code为200时，才会有返回这个ResponseData的数据<br>
 * code(200或400)为状态码，<br>
 * code为400时msg中会有错误信息(可供前端alert)，<br>
 * code为200时result中存储成功返回的数据
 */
export interface ResponseData<T = any> {
    code: string
    msg: string
    result: T
}

export type AxiosResponseData<T> = AxiosResponse<ResponseData<T>>

//当前实例的拦截器，对所有从后端收到的请求进行处理，检验http的状态码
service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response;
        } else {
            return Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
)

//设置为全局变量
export {
    service as axios
}

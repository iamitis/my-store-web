import axios from "axios";
import {AxiosResponseData} from "../utils/request.ts";


export const llmService = axios.create({
    baseURL: 'http://localhost:8080/api/LLM',
    timeout: 30000,
});

export async function chat(msg:string):Promise<AxiosResponseData<string>> {
    console.log('Requesting URL:', llmService.defaults.baseURL + '/chat?msg=' + msg);
    return await llmService.get('/chat', {
       params: {
           msg: msg
       }
   });


}

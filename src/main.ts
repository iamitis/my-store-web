// createApp是Vue3的一个函数，用于创建一个新的Vue应用实例。
// 这个函数接收一个根组件作为参数，并返回一个可以链式调用的应用实例。
// App是从./App.vue文件中导入的默认导出。在Vue中，.vue文件通常代表一个单文件组件。
// 所以，App是你的应用的根组件。
import {createApp, reactive, readonly, ref} from 'vue'
import {router} from './router'
import App from './App.vue'
import axios from 'axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import {User} from "./api/user.ts";


//设置后端地址（本地或服务器），会将请求转发到后端端口
axios.defaults.baseURL = ("http://localhost:8080")
axios.defaults.timeout = 30000;

//创建一个新的Vue应用实例，使用ElementPlus插件和路由，然后挂载到页面上id为'app'的元素上。
const app = createApp(App)
app.use(router)
app.use(ElementPlus)

const currUser: User = reactive({
    id: -1,
    phone: '',
})

export function updateUser(user: User) {
    currUser.id = user.id
    currUser.phone = user.phone
}

app.provide('currUser', readonly(currUser))

const isHeaderVisible = ref(true)
export function updateHeaderVisible(visible: boolean) {
    isHeaderVisible.value = visible
}
app.provide('isHeaderVisible', readonly(isHeaderVisible))

app.mount('#app')
import {createRouter, createWebHashHistory, useRouter} from "vue-router"
import {computed} from "vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            name: 'Home',
            component: () => import('../views/Home.vue'),
        },
        {
            path: '/category-detail/:backEndName',
            name: 'CategoryDetail',
            component: () => import('../views/CategoryDetail.vue'),
        },
        {
            path: '/notification-page',
            name: 'NotificationPage',
            component: () => import('../views/NotificationPage.vue'),
        },
        {
            path: '/user-page/:userId',
            name: 'UserPage',
            component: () => import('../views/UserPage.vue'),
        },
        {
            path: '/404',
            name: '404',
            component: () => import('../views/NotFound.vue'),
            meta: {title: '404'}
        },
        {
            path: '/:catchAll(.*)',
            redirect: '/404'
        }
    ]
})

export {router}

export function initRouter() {
    const router = useRouter()
    const currRouteName = computed(() => router.currentRoute.value.name)

    function navTo(routeName: string, params?: any) {
        if (routeName === currRouteName.value) {
            return;
        }
        router.push({name: routeName, params: params})
    }

    return {router, currRouteName, navTo}
}

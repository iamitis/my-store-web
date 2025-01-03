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
            path: '/discount',
            name: 'Discount',
            component: () => import('../views/Discount.vue'),
        },
        {
            path: '/search',
            name: 'SearchPage',
            component: () => import('../views/SearchPage.vue'),
        },
        {
            path: '/product-detail/:productId',
            name: 'ProductDetail',
            component: () => import('../views/product/ProductDetail.vue'),
        },
        {
            path: '/create-order',
            name: 'CreateOrder',
            component: () => import('../views/CreateOrder.vue'),
        },

        {
            path: '/user-page/:userId',
            name: 'UserPage',
            redirect(to) {
                return {name: 'Overview', params: to.params}
            },
            component: () => import('../views/user/UserPage.vue'),
            children: [
                {
                    path: '/overview',
                    name: 'Overview',
                    component: () => import('../views/user/Overview.vue'),
                },
                {
                    path: '/order',
                    name: 'Order',
                    component: () => import('../views/user/Order.vue'),
                },
                {
                    path: '/shopping-cart',
                    name: 'ShoppingCart',
                    component: () => import('../views/user/ShoppingCart.vue'),
                },
                {
                    path: '/address-book',
                    name: 'AddressBook',
                    component: () => import('../views/user/AddressBook.vue'),
                },
                {
                    path: '/notification',
                    name: 'Notification',
                    component: () => import('../views/user/Notification.vue'),
                },
                {
                    path: '/history',
                    name: 'History',
                    component: () => import('../views/user/Footprint.vue'),
                },
            ],
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
        if (routeName === currRouteName.value && params === undefined) {
            return;
        }
        router.push({name: routeName, params: params})
    }

    return {router, currRouteName, navTo}
}

import {mockOptionValue1, mockOptionValue4, mockProduct, Product, ProductOptionValue} from "./product.ts";
import {AxiosResponseData} from "../utils/request.ts";
import axios from "axios";

export interface User {
    id?: number,
    phone?: string,
    role?: UserRole,
    password?: string,
    related_phone?: string,
}


export enum UserRole {
    PARENT = 'PARENT',
    CHILD = 'CHILD',
}

type LoginInfo = {
    phone: string,
    password: string
}

type RegisterInfo ={
    phone:string,
    password:string,
    role:UserRole,
    related_phone:string,
}

export const userService = axios.create({
    baseURL: 'http://localhost:8080/api/users',
    timeout: 30000,
});

export const userPageTitleMap: Map<string, string> = new Map()
userPageTitleMap.set('Overview', '我的账号')
userPageTitleMap.set('Order', '我的订单')
userPageTitleMap.set('ShoppingCart', '我的购物车')
userPageTitleMap.set('AddressBook', '我的收货地址')
userPageTitleMap.set('Notification', '我的消息')
userPageTitleMap.set('ParentOrder', '父母订单')

export interface CartItem {
    cartItemId?: number,
    userId?: number,
    product?: Product,
    productOptionValues?: ProductOptionValue[],
    quantity?: number,
    cartItemDate?: Date,
}

export async function getShoppingCart(userId: number): Promise<AxiosResponseData<CartItem[]>> {
    return await userService.get(`/getShoppingCart/${userId}`)
}

export async function login(loginInfo : LoginInfo): Promise<AxiosResponseData<User>> {
    return await userService.post('/login',loginInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res=>{
            return res;
        })
}

export async function register(registerInfo:RegisterInfo): Promise<AxiosResponseData<boolean>> {
    return await userService.post('/register',registerInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res=>{
            return res;
        })
}

export async function addToShoppingCart(cartItem: CartItem): Promise<AxiosResponseData<CartItem>> {
    return await userService.post(`/addCartItem`, cartItem)
}

/**
 * 更新购物车项(中的商品数量)
 */
export async function updateCartItem(cartItem: CartItem): Promise<AxiosResponseData<CartItem>> {
    return await userService.post(`/updateCartItem`, cartItem)
}

/**
 * 删除购物车项
 */
export async function deleteCartItem(cartItemId: number): Promise<AxiosResponseData<boolean>> {
    return await userService.delete(`/deleteCartItem/${cartItemId}`)
}

export async function getCartCount(userId: number) {
    return (await getShoppingCart(userId)).data.result.length
}

export async function getIdByPhone(phone: string): Promise<AxiosResponseData<number> > {
    return await userService.get(`/getIdByPhone/${phone}`)
}

export interface AddressInfo {
    addressInfoId?: number,
    userId: number,
    areaAddress: Array<string>, // 省市区
    detailAddress: string, // 详细地址
    phone: string,
    receiver: string, // 收件人
    isDefault: boolean, // 是否为默认地址
}

/**
 * 获取用户的所有收货地址
 * 如果用户没有收货地址，返回空 list
 * 如果有默认地址，返回时需将默认地址排在最前面
 */
export async function getAllAddressInfo(userId: number): Promise<AxiosResponseData<AddressInfo[]>> {
    return await userService.get(`/getAllAddressInfo/${userId}`)
}

/**
 * 添加收货地址
 * 如果 addressInfo.isDefault 为 true 且原来已有默认地址，还需将原来的默认地址设为非默认
 * @return 返回新添加的地址
 */
export async function addAddressInfo(addressInfo: AddressInfo): Promise<AxiosResponseData<AddressInfo>> {
    return await userService.post(`/addAddressInfo`, addressInfo)
}

/**
 * 更新收获地址
 * 如果 addressInfo.isDefault 为 true，还需将原来的默认地址设为非默认
 * @return 返回更新后的地址
 */
export async function updateAddressInfo(addressInfo: AddressInfo): Promise<AxiosResponseData<AddressInfo>> {
    return await userService.post(`/updateAddressInfo`, addressInfo)
}

export async function deleteAddressInfo(addressInfoId: number): Promise<AxiosResponseData<boolean>> {
    return await userService.delete(`/deleteAddressInfo/${addressInfoId}`)
}


export const mockCartItem: CartItem = {
    cartItemId: 1,
    userId: 1,
    product: mockProduct,
    productOptionValues: [mockOptionValue1, mockOptionValue4],
    quantity: 1,
    cartItemDate: new Date(),
}

export const mockAddressInfo: AddressInfo = {
    addressInfoId: 1,
    userId: 0,
    areaAddress: ['江苏省', '南京市', '鼓楼区'],
    detailAddress: '汉口路22号南京大学鼓楼校区南园',
    phone: '12345678901',
    receiver: '小南',
    isDefault: false,
}

export const emptyAddressInfo: AddressInfo = {
    userId: 0,
    areaAddress: [],
    detailAddress: '',
    phone: '',
    receiver: '',
    isDefault: false,
}

export function areaAddressToString(areaAddress: string[]): string {
    return areaAddress.join(' ')
}

export function copyAddressInfo(addressInfo: AddressInfo): AddressInfo {
    return {
        addressInfoId: addressInfo.addressInfoId,
        userId: addressInfo.userId,
        areaAddress: [...addressInfo.areaAddress],
        detailAddress: addressInfo.detailAddress,
        phone: addressInfo.phone,
        receiver: addressInfo.receiver,
        isDefault: addressInfo.isDefault,
    }
}

export const roleMap: Map<UserRole, string> = new Map()
roleMap.set(UserRole.PARENT, '长辈')
roleMap.set(UserRole.CHILD, '子女')





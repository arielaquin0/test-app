import request from '@/utils/request'

export function login(data) {
    return request({
        // url: `/login?email=${data.email}&password=${data.password}&source=web`,
        url: `/login`,
        method: 'post',
        data
    })
}

export function getInfo() {
    return request({
        url: '/user/info',
        method: 'get'
    })
}

export function logout() {
    return request({
        url: '/logout',
        method: 'post'
    })
}

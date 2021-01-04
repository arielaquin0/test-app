import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE,
  //withCredentials: true, // send cookies when cross-domain requests
  timeout: 30 * 1000,
    headers: {
        Authorization: true,
        Accept: 'application/xlsx'
    }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer '+getToken()
      // axios.defaults.headers.common['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log('err ' + error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data

    // if the custom code is not 0, it is judged as an error.
    if (res.code !== 200) {
      // if ((res.code <= -100 && res.code >= -105) || (res.code <= -400 && res.code >= -404)) {
      //   Message({
      //     message: res.msg || 'Error',
      //     type: 'error',
      //     duration: 5 * 1000
      //   })
      // }
      //
      // if (res.code >= 6000) {
      //   // to re-login
      //   MessageBox(res.msg, 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   }).catch(()=>{})
      // }
      return Promise.reject(res)
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
        message: error.msg,
        type: 'error',
        duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

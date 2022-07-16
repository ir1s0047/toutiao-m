import request from '@/utils/request'
/**
 *
 * @param {String} mobile
 * @param {String} code
 * @returns
 */
export const login = (mobile, code) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: { mobile, code }
  })
}

// 发送验证码
/**
 *
 * @param {String} mobile
 * @returns
 */
export const sendCode = (mobile) => {
  return request({
    url: `/v1_0/sms/codes/${mobile}`
  })
}

export const getUserInfo = () => {
  return request({
    url: '/v1_0/user'
  })
}

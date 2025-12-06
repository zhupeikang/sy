const config: {
  // base_url: {
  //   local:string
  //   dev: string
  //   test: string
  //   pro: string
  // }, websocket: {
  //   local:string
  //   dev: string
  //   test: string
  //   pro: string
  // },
  result_code: number | string
  default_headers: AxiosHeaders
  request_timeout: number
} = {
  /**
   * api请求基础路径
   */
  // base_url: {
  //   // 开发环境接口前缀
  //   local: 'http://192.168.85.45:8787/v2',
  //   // 开发环境接口前缀
  //   dev: 'http://test-api-sylf.zhizhangame.com:8787/v2',

  //   // 打包测试环境接口前缀
  //   test: 'https://test-v2-api-sylf.zhizhangame.com/v2',

  //   // 打包生产环境接口前缀
  //   pro: 'http://api-sylf.zhizhangame.com/v2',

  // },
  // websocket: {
  //   // 开发环境接口前缀
  //   local: 'http://192.168.85.45:2120',
  //   // 开发环境接口前缀
  //   dev: 'http://test-api-sylf.zhizhangame.com:2120',

  //   // 打包测试环境接口前缀
  //   test: 'http://test-api-sylf.zhizhangame.com:2120',

  //   // 打包生产环境接口前缀
  //   pro: 'http://api-sylf.zhizhangame.com:2120',
  // },

  /**
   * 接口成功返回状态码
   */
  result_code: 200,

  /**
   * 接口请求超时时间
   */
  request_timeout: 60000,

  /**
   * 默认接口请求类型
   * 可选值：application/x-www-form-urlencoded multipart/form-data
   */
  // default_headers: 'application/json'
  default_headers: 'application/x-www-form-urlencoded'
}

export { config }

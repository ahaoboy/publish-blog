import axios from "axios";
import qs from "qs";

axios.interceptors.request.use(
  function (config) {
    if (config.method === "post") {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    console.log("response", response.status);
    return response.data;
  },
  function (error) {
    // 对响应错误做点什么
    // console.log("error");
    return Promise.reject(error);
  }
);

export default axios;

import axios from "axios";
import Cookies from "js-cookie";

export abstract class APIService {
  protected headers: any = {};


  setRefreshToken(token: string) {
    Cookies.set("refreshToken", token, { expires: 30 });
  }

  getRefreshToken() {
    return Cookies.get("refreshToken");
  }

  purgeRefreshToken() {
    Cookies.remove("refreshToken", { path: "/" });
  }

  setAccessToken(token: string) {
    Cookies.set("accessToken", token, { expires: 30 });
  }

  getAccessToken() {
    return Cookies.get("accessToken");
  }

  purgeAccessToken() {
    Cookies.remove("accessToken", { path: "/" });
  }

  getHeaders() {
    return {
      Authorization: `Bearer ${this.getAccessToken()}`,
    };
  }

  get(url: string, config = {}): Promise<any> {
    return axios({
      method: "get",
      url: url,
      headers: this.getAccessToken() ? this.getHeaders() : {},
      ...config,
    });
  }

  post(url: string, data = {}, config = {}): Promise<any> {
    return axios({
      method: "post",
      url: url,
      data,
      headers: this.getAccessToken() ? this.getHeaders() : {},
      ...config,
    });
  }

  put(url: string, data = {}, config = {}): Promise<any> {
    return axios({
      method: "put",
      url: url,
      data,
      headers: this.getAccessToken() ? this.getHeaders() : {},
      ...config,
    });
  }

  patch(url: string, data = {}, config = {}): Promise<any> {
    return axios({
      method: "patch",
      url: url,
      data,
      headers: this.getAccessToken() ? this.getHeaders() : {},
      ...config,
    });
  }

  delete(url: string, data?: any, config = {}): Promise<any> {
    return axios({
      method: "delete",
      url: url,
      data: data,
      headers: this.getAccessToken() ? this.getHeaders() : {},
      ...config,
    });
  }

  request(config = {}) {
    return axios(config);
  }
}

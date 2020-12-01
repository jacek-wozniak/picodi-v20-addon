import {AxiosResponse, AxiosError} from "axios/index";
import CockpitRouter from "../CockpitRouter";
import HttpResponse from "./structures/HttpResponseBackground";
import axios from "axios";

export default class ApiClient {
  private authorizationToken: string;
  private cockpitRouter: CockpitRouter;

  public constructor(cockpitRouter: CockpitRouter, authorizationToken: string) {
    this.authorizationToken = authorizationToken;
    this.cockpitRouter = cockpitRouter;
  }

  public getOffersList(domain: string): Promise<any> {
    return this.get('api.offers.recognize', {domain: domain});
  }

  public addonInstall(installationId: string): Promise<any> {
    return this.post('api.addon.install', {installationId: installationId}, {installationId: userId});
  }

  public showResponse(httpResponse: HttpResponse) {
    if(httpResponse.response.data.message){
      console.log(httpResponse.response.data.message);
    }
  }

  private post(key: string, params: any, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const httpResponse = new HttpResponse();
      axios.post(this.cockpitRouter.getUrl(key, params), data, this.getConfig())
        .then((response: AxiosResponse) => {
          httpResponse.setResponse(response);
          resolve(httpResponse);
        })
        .catch((error: AxiosError) => {
          httpResponse.setError(error);
          reject(httpResponse);
        });
    });
  }

  private put(key: string, params: any, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const httpResponse = new HttpResponse();
      axios.put(this.cockpitRouter.getUrl(key, params), data, this.getConfig())
        .then((response: AxiosResponse) => {
          httpResponse.setResponse(response);
          resolve(httpResponse);
        })
        .catch((error: AxiosError) => {
          httpResponse.setError(error);
          reject(httpResponse);
        });
    });
  }

  private get(key: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const httpResponse = new HttpResponse();
      axios.get(this.cockpitRouter.getUrl(key, params), this.getConfig())
        .then((response: AxiosResponse) => {
          httpResponse.setResponse(response);
          resolve(httpResponse);
        })
        .catch((error: AxiosError) => {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }

        });
    });
  }

  private getConfig(): any {
    return {
      'headers': {
      //  'Authorization': this.authorizationToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      'withCredentials': true
    };
  }
}

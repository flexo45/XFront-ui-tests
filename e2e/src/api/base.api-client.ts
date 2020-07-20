import {browser, promise} from 'protractor';
import {TestConf} from '../test.conf';
import {protractor} from 'protractor/built/ptor';
import Deferred = promise.Deferred;


export class BaseApiClient {

  private apiBaseUrl: string;
  protected request = require('request');

  constructor() {
    this.apiBaseUrl = new TestConf().api.url;
  }

  protected async getCurrentUserAccessToken(): Promise<string> {
    const access_token = await browser.executeScript('return localStorage.getItem("access_token")');
    return access_token == null ? '' : access_token.toString();
  }

  private getUrl(path: string): string {
    return `${this.apiBaseUrl}${path}`;
  }

  private async processRequest<T>(request: Function): Promise<ApiResponse<T>> {
    const deferred = protractor.promise.defer<ApiResponse<T>>();
    await request(deferred);
    return Promise.resolve(deferred.promise);
  }

  private async processRequestEmpty(request: Function): Promise<ApiResponseEmpty> {
    const deferred = protractor.promise.defer<ApiResponseEmpty>();
    await request(deferred);
    return Promise.resolve(deferred.promise);
  }

  protected async get<T>(path: string): Promise<ApiResponse<T>> {
    return await this.processRequest<T>(async (deferred) => {
      this.request.get({
        url: this.getUrl(path),
        headers: {
          'Authorization': `Bearer ${await this.getCurrentUserAccessToken()}`
        }
      }, (err, response, content) => {
        this.responseCallback<T>(err, response, content, deferred);
      });
    });
  }

  protected async delete(path: string): Promise<ApiResponseEmpty> {
    return await this.processRequestEmpty(async (deferred) => {
      this.request.delete({
        url: this.getUrl(path),
        headers: {
          'Authorization': `Bearer ${await this.getCurrentUserAccessToken()}`
        }
      }, (err, response, content) => {
        this.responseCallbackEmpty(err, response, content, deferred);
      });
    });
  }

  protected async put<T>(path: string, body: any = null): Promise<ApiResponse<T>> {
    return await this.processRequest<T>(async (deferred) => {
      this.request.put({
        url: this.getUrl(path),
        headers: {
          'Authorization': `Bearer ${await this.getCurrentUserAccessToken()}`
        },
        json: body != null,
        body: body
      }, (err, response, content) => {
        this.responseCallback<T>(err, response, content, deferred);
      });
    });
  }

  protected async post<T>(path: string, body: any): Promise<ApiResponse<T>> {
    return this.processRequest<T>(async (deferred) => {
      this.request.post({
        url: this.getUrl(path),
        headers: {
          'Authorization': `Bearer ${await this.getCurrentUserAccessToken()}`
        },
        json: true,
        body: body
      }, (err, response, content) => {
        this.responseCallback<T>(err, response, content, deferred);
      });
    });
  }

  protected responseCallback<T>(err, response, content, deferred: Deferred<ApiResponse<T>>) {

    if (err)
      throw new Error(`ApiClient: Error on request ${err}`);

    const apiResponse = new ApiResponse<T>();
    apiResponse.statusCode = response.statusCode;

    if (response.statusCode === 200) {
      try {
        if (content !== undefined && content !== '')
          apiResponse.message = content.constructor === String ? JSON.parse(content) as T : content as T;

      } catch (e) {
        console.error('invalid content response');
        console.error(content);
        deferred.reject(e);
      }
    } else {
      try {
        apiResponse.error = content.constructor === String ? JSON.parse(content) as ApiError : content as ApiError;
      } catch (e) {
        apiResponse.error = content;
      }
    }
    deferred.fulfill(apiResponse);
  }

  protected responseCallbackEmpty(err, response, content, deferred: Deferred<ApiResponseEmpty>) {

    if (err)
      throw new Error(`ApiClient: Error on request ${err}`);

    const apiResponse = new ApiResponseEmpty();
    apiResponse.statusCode = response.statusCode;

    if (response.statusCode !== 200) {
      try {
        apiResponse.error = content.constructor === String ? JSON.parse(content) as ApiError : content as ApiError;
      } catch (e) {
        apiResponse.error = content;
      }
    }
    deferred.fulfill(apiResponse);
  }
}

export class ApiResponse<T> {
  public message: T;
  public statusCode: number;
  public error?: ApiError;
}

export class ApiResponseEmpty {
  public statusCode: number;
  public error?: ApiError;
}

export class ApiError {
  public code: string;
  public message: string;
  public fields: any;
}

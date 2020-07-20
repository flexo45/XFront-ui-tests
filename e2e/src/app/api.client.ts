import {protractor} from 'protractor/built/ptor';
import {browser} from 'protractor';
import {AttachExchangeRequest} from '../../../src/app/api/models/attach-exchange-request';
import {DepositoryResponse} from '../../../src/app/api/models/depository-response';
import {AttachWalletRequest} from '../../../src/app/api/models/attach-wallet-request';

const request = require('request');

export class ApiClient {

  private apiBaseUrl: string;

  constructor(apiBaseUrl: string) {
    this.apiBaseUrl = apiBaseUrl;
  }

  private async getCurrentUserAccessToken(): Promise<string> {
    const access_token = await browser.executeScript('return localStorage.getItem("access_token")');
    if (access_token == null) {
      throw new Error('Cant find current user access_token');
    }
    return access_token.toString();
  }

  public async deleteDepository(id: string): Promise<void> {
    const deferred = protractor.promise.defer<void>();
    request.delete({
      url: this.apiBaseUrl + `/Depositories/${id}`,
      headers: {
        'Authorization': `Bearer ${await this.getCurrentUserAccessToken()}`
      }
    }, (err, res, body) => {
      if (err) { deferred.reject(err); }
      deferred.fulfill();
    });
    return Promise.resolve(deferred.promise);
  }

  public async createExchangeDepository(attachRequest: AttachExchangeRequest): Promise<DepositoryResponse> {
    const deferred = protractor.promise.defer<DepositoryResponse>();
    request.post({
      url: `${this.apiBaseUrl}/Depositories/exchange`,
      headers: {
        'Authorization': `Bearer ${await this.getCurrentUserAccessToken()}`
      },
      json: true,
      body: attachRequest
    }, (err, res, body) => {
      if (err) {
        deferred.reject(err);
      }
      if (res.statusCode !== 200) {
        console.error(`ApiError code: ${res.statusCode}, message=`);
        console.error(body);
        deferred.reject(`ApiError code: ${res.statusCode}`);
      }
      deferred.fulfill(body as DepositoryResponse);
    });
    return Promise.resolve(deferred.promise);
  }

  public async createWalletDepository(attachRequest: AttachWalletRequest): Promise<DepositoryResponse> {
    const deferred = protractor.promise.defer<DepositoryResponse>();
    request.post({
      url: `${this.apiBaseUrl}/Depositories/wallet`,
      headers: {
        'Authorization': `Bearer ${await this.getCurrentUserAccessToken()}`
      },
      json: true,
      body: attachRequest
    }, (err, res, body) => {
      if (err) {
        deferred.reject(err);
      }
      if (res.statusCode !== 200) {
        console.error(`ApiError code: ${res.statusCode}, message=`);
        console.error(body);
        deferred.reject(`ApiError code: ${res.statusCode}`);
      }
      deferred.fulfill(body as DepositoryResponse);
    });
    return Promise.resolve(deferred.promise);
  }

}

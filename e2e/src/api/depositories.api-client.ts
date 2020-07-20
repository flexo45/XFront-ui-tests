import {ApiResponse, ApiResponseEmpty, BaseApiClient} from './base.api-client';
import {AttachExchangeRequest} from '../../../src/app/api/models/attach-exchange-request';
import {DepositoryResponse} from '../../../src/app/api/models/depository-response';
import {AttachWalletRequest} from '../../../src/app/api/models/attach-wallet-request';
import {CollectionResponse} from '../../../src/app/collection.response';
import {DepositoryUpdateRequest} from '../../../src/app/api/models/depository-update-request';

export class DepositoriesApiClient extends BaseApiClient{

  public async deleteDepository(userDepositoryId: string): Promise<ApiResponseEmpty> {
    return await this.delete(`/Depositories/${userDepositoryId}`);
  }

  public async getDepositories(): Promise<ApiResponse<CollectionResponse<DepositoryResponse>>> {
    return await this.get<CollectionResponse<DepositoryResponse>>(`/Depositories`);
  }

  public async getDepository(userDepositoryId: string): Promise<ApiResponse<DepositoryResponse>> {
    return await this.get<DepositoryResponse>(`/Depositories/${userDepositoryId}`);
  }

  public async createExchange(attachRequest: AttachExchangeRequest): Promise<ApiResponse<DepositoryResponse>> {
    return await this.post<DepositoryResponse>(`/Depositories/exchange`, attachRequest);
  }

  public async createWallet(attachRequest: AttachWalletRequest): Promise<ApiResponse<DepositoryResponse>> {
    return await this.post<DepositoryResponse>(`/Depositories/wallet`, attachRequest);
  }

  public async updateDepository(userDepositoryId: string, updateRequest: DepositoryUpdateRequest): Promise<ApiResponse<DepositoryResponse>> {
    return await this.put<DepositoryResponse>(`/Depositories/${userDepositoryId}`, updateRequest);
  }
}

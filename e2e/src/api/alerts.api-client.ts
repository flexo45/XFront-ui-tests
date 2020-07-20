import {ApiResponse, ApiResponseEmpty, BaseApiClient} from './base.api-client';
import {CollectionResponse} from '../../../src/app/collection.response';
import {AlertResponse} from '../../../src/app/api/models/alert-response';
import {AlertUpdateRequest} from '../../../src/app/api/models/alert-update-request';
import {AlertNotificationsResponse} from '../../../src/app/api/models/alert-notifications-response';

export class AlertsApiClient extends BaseApiClient{

  public async getAlerts(): Promise<ApiResponse<CollectionResponse<AlertResponse>>> {
    return await this.get<CollectionResponse<AlertResponse>>(`/alerts`);
  }

  public async getNotifications(take: number, skip: number): Promise<ApiResponse<CollectionResponse<AlertNotificationsResponse>>> {
    return await this.get<CollectionResponse<AlertNotificationsResponse>>(`/alerts/notifications?take=${take}&skip=${skip}`);
  }

  public async getAlert(alertId: string): Promise<ApiResponse<AlertResponse>> {
    return await this.get<AlertResponse>(`/alerts/${alertId}`);
  }

  public async createAlert(createRequest: AlertUpdateRequest): Promise<ApiResponseEmpty> {
    return await this.post<ApiResponseEmpty>(`/alerts`, createRequest);
  }

  public async updateAlert(alertId: string, updateRequest: AlertUpdateRequest): Promise<ApiResponseEmpty> {
    return await this.put<ApiResponseEmpty>(`/alerts/${alertId}`, updateRequest);
  }

  public async disableAlert(alertId: string): Promise<ApiResponseEmpty> {
    return await this.put<ApiResponseEmpty>(`/alerts/${alertId}/disable`);
  }

  public async enableAlert(alertId: string): Promise<ApiResponseEmpty> {
    return await this.put<ApiResponseEmpty>(`/alerts/${alertId}/enable`);
  }

  public async deleteAlert(alertId: string): Promise<ApiResponseEmpty> {
    return await this.delete(`/alerts/${alertId}`);
  }
}

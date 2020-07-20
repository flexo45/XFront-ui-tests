import {DbAlerts} from './data-access/db.alerts';
import {AlertDb, NotificationDb} from './data-access/db.model';
import {AlertUpdateRequest} from '../../src/app/api/models/alert-update-request';

export class AlertsService {

  constructor(private dbAlerts: DbAlerts) {

  }

  public async getAlertsListOfUser(userId: string): Promise<AlertDb[]> {
    return await this.dbAlerts.selectAllAlertsByUserId(userId);
  }

  public async getNotificationsOfUser(userId: string): Promise<NotificationDb[]> {
    return await this.dbAlerts.selectAllNotificationsByUserId(userId);
  }

  public async deleteAllAlertsOfUser(userId: string) {
    await this.dbAlerts.deleteAllAlertsByUserId(userId);
  }

  public async changeAlertActiveState(alertId: string, isDisabled: boolean) {
    await this.dbAlerts.updateAlertActivityState(alertId, isDisabled);
  }

  public async createAlertOfUser(
    alert: AlertUpdateRequest,
    isDisabled: boolean = false,
    isDeleted: boolean = false,
    userId: string): Promise<AlertDb> {
    const alertId = await this.dbAlerts.insertAlert(userId, alert, isDisabled, isDeleted);
    return {
      id: alertId,
      userId: userId,
      currencyId: alert.currencyId,
      value: alert.thresholdValue,
      isDisabled: isDisabled,
      isDeleted: isDeleted,
      isRepeating: alert.isRepeating
    };
  }

  public async createNotificationForUser(alert: AlertDb,
                                         currencyUsdPrice: number,
                                         isRead: boolean = false,
                                         daysAgo: number = 0): Promise<string> {
    return await this.dbAlerts.insertNotification(alert.userId, alert.id, alert.currencyId, currencyUsdPrice, alert.value, daysAgo, isRead);
  }

}

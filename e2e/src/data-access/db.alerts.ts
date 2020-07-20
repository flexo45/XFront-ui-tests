import {DbClient} from './db.client';
import {AlertDb, NotificationDb} from './db.model';
import {AlertUpdateRequest} from '../../../src/app/api/models/alert-update-request';

export class DbAlerts {

  constructor(
    private dbClient: DbClient = DbClient.getInstance()) {}

  public async selectAllAlertsByUserId(userId: string): Promise<AlertDb[]> {
    return await this.dbClient.selectT<AlertDb>(new AlertDb(),
      `select * from "Alerts" where "UserId" = $1`, [userId]);
  }

  public async selectAllNotificationsByUserId(userId: string): Promise<NotificationDb[]> {
    return await this.dbClient.selectT<NotificationDb>(new NotificationDb(),
      `select * from "AlertNotifications" where "UserId" = $1 order by "Date" desc`, [userId]);
  }

  public async deleteAllAlertsByUserId(userId: string) {
    await this.dbClient.execute(`delete from "Alerts" where "UserId" = $1`, [userId]);
  }

  public async updateAlertActivityState(alertId: string, isDisabled: boolean) {
    await this.dbClient.execute(`update "Alerts" set "IsDisabled" = $2 where "Id" = $1`, [alertId, isDisabled]);
  }

  public async insertAlert(userId: string, alert: AlertUpdateRequest,
                           isDisabled: boolean = false,
                           isDeleted: boolean = false): Promise<string> {
    const guidAlert = await this.dbClient.getGuid();
    await this.dbClient.execute(
      `insert into "Alerts" ("Id", "UserId", "CurrencyId", "Value", "IsDisabled", "IsDeleted", "IsRepeating")
             values ($1, $2, $3, $4, $5, $6, $7)`,
      [guidAlert, userId, alert.currencyId, alert.thresholdValue, isDisabled, isDeleted, alert.isRepeating]);
    return guidAlert;
  }

  public async insertNotification(userId: string,
                                  alertId: string,
                                  currencyId: string,
                                  currencyUsdPrice: number,
                                  value: number,
                                  days: number,
                                  isRead: boolean): Promise<string> {
    const guidAlert = await this.dbClient.getGuid();
    await this.dbClient.execute(
      `insert into "AlertNotifications" ("Id", "CurrencyId", "Value", "CurrencyUsdPrice", "UserId", "AlertId", "Date", "IsRead")
            values ($1, $2, $3, $4, $5, $6, now() - interval '${days} DAYS', $7 )`,
      [guidAlert, currencyId, value, currencyUsdPrice, userId, alertId, isRead]);
    return guidAlert;
  }
}

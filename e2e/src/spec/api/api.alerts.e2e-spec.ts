import {getRandom, TCTesting} from '../../utils';
import {AppTestFixture, CurrencyTestContext} from '../../app.test-fixture';
import {ApiResponseEmpty} from '../../api/base.api-client';
import {AlertDb, DepositoryResponseModel, NotificationDb} from '../../data-access/db.model';
import '../../extantions/array.extansion';
import '../../extantions/date.extantion';
import {AlertResponse} from '../../../../src/app/api/models/alert-response';
import {CollectionResponse} from '../../../../src/app/collection.response';
import {AlertNotificationsResponse} from '../../../../src/app/api/models/alert-notifications-response';
import {DepositoryType} from '../../../../src/app/depository/depository-type';

TCTesting.TestSuite(`API - Alerts controller test suite`, () => {

  const fixture: AppTestFixture = new AppTestFixture();
  let currencies;

  beforeAll(async () => {
    fixture.defaultUser = fixture.config.users.default;
    await fixture.relogin(fixture.defaultUser);
    await fixture.portfolio.deleteAllDepositoriesOfUser();
    await fixture.portfolio.deleteAllDepositoriesOfUser(fixture.config.users.support.id);
    await fixture.portfolio.deleteAllAlertsOfUser();
    currencies = await fixture.portfolio.currenciesService.getSomeCurrencies(10);
    for (const otherAlert of [
      {user: fixture.config.users.support, repeating: true, disabled: false, deleted: false},
      {user: fixture.config.users.support, repeating: false, disabled: false, deleted: false},
      {user: fixture.config.users.support, repeating: true, disabled: true, deleted: false},
      {user: fixture.config.users.support, repeating: true, disabled: false, deleted: true},
      {user: fixture.config.users.support, repeating: true, disabled: true, deleted: true},
      {user: fixture.config.users.empty, repeating: true, disabled: false, deleted: false},
      {user: fixture.config.users.empty, repeating: false, disabled: false, deleted: false},
      {user: fixture.config.users.empty, repeating: true, disabled: true, deleted: false}
    ]) {
      await fixture.portfolio.addAlert({
        thresholdValue: getRandom(100, 1000),
        currencyId: currencies.randomElement().id,
        isRepeating: otherAlert.repeating
      }, otherAlert.disabled, otherAlert.deleted, otherAlert.user.id);
    }
  });

  afterAll(async () => {
    await fixture.portfolio.deleteAllDepositoriesOfUser();
    fixture.defaultUser = fixture.config.users.default;
  });

  for (const testCase of [
    {alerts: [
        {repeating: true, disabled: false, deleted: false},
        {repeating: false, disabled: false, deleted: false},
        {repeating: false, disabled: true, deleted: false},
        {repeating: true, disabled: false, deleted: false},
        {repeating: true, disabled: false, deleted: false},
        {repeating: true, disabled: false, deleted: true},
        {repeating: false, disabled: true, deleted: true}
      ]}
  ]) {
    TCTesting.TestSuite(`(GET) - should return all alerts of user`, () => {
      let alertsList: CollectionResponse<AlertResponse>;
      let expectedAlerts: AlertDb[];
      beforeAll(async () => {
        await fixture.portfolio.deleteAllAlertsOfUser();
        // create test data (alerts for GET)
        for (const alert of testCase.alerts) {
          await fixture.portfolio.addAlert({
            thresholdValue: getRandom(100, 1000),
            currencyId: currencies.randomElement().id,
            isRepeating: alert.repeating
          }, alert.disabled, alert.deleted);
        }
      });
      TCTesting.TestCase(`http response code should be 200 OK`, async () => {
        const response = await fixture.alertsApiClient.getAlerts();
        expect(response.statusCode).toBe(200, response.error);
        alertsList = response.message;
        expectedAlerts = await fixture.portfolio.getAlertsOfUser(fixture.defaultUser.id, (value) => {
          return !value.isDeleted;
        });
      });
      TCTesting.TestCase(`count of items in response should by correct`, async () =>
        expect(alertsList.items.length).toBe(expectedAlerts.length));
      TCTesting.TestSuite(`Alert items in response should by correct`, () => {
        const countOfViewingTest = testCase.alerts.filter((x) => !x.deleted).length;
        for (let i = 0; i < countOfViewingTest; i++) {
          let actual: AlertResponse;
          let currencyOfAlert: CurrencyTestContext;
          beforeAll(async () => {
            actual = alertsList.items.find((x) => x.id === expectedAlerts[i].id);
            currencyOfAlert = currencies.find((x) => x.id === expectedAlerts[i].currencyId);
          });
          TCTesting.TestCase(`alert with n${i} should be exist in response`, async () => {
            expect(actual).not.toBeUndefined();
          });
          TCTesting.TestCase(`assert thresholdValue`,
            async () => expect(actual.thresholdValue).toBe(parseFloat(expectedAlerts[i].value.toString())));
          TCTesting.TestCase(`assert isRepeating`, async () => expect(actual.isRepeating).toBe(expectedAlerts[i].isRepeating));
          TCTesting.TestCase(`assert currency.id`, async () => expect(actual.currency.id).toBe(expectedAlerts[i].currencyId));
          TCTesting.TestCase(`assert currency.ticker`, async () => expect(actual.currency.ticker).toBe(currencyOfAlert.ticker));
          TCTesting.TestCase(`assert currency.name`, async () => expect(actual.currency.name).toBe(currencyOfAlert.name));
          TCTesting.TestCase(`assert currency.priceUsd`,
            async () => expect(actual.currency.priceUsd).toBe(parseFloat(currencyOfAlert.price.toString())));
          TCTesting.TestCase(`assert currency.imageUrl`,
            async () => expect(actual.currency.imageUrl).toBe(fixture.config.api.url + currencyOfAlert.imageUrl));
          TCTesting.TestCase(`assert currency.convertibleIconUrl`,
            async () => expect(actual.currency.convertibleIconUrl)
              .toBe(currencyOfAlert.convertibleIconUrl == null ? null : (fixture.config.api.url + currencyOfAlert.convertibleIconUrl)));
        }
      });
    });
  }

  for (const testCase of [
    {repeating: true, disabled: false, deleted: false},
    {repeating: false, disabled: false, deleted: false},
    {repeating: false, disabled: true, deleted: false},
    {repeating: true, disabled: false, deleted: false},
    {repeating: true, disabled: false, deleted: false},
    {repeating: true, disabled: false, deleted: true},
    {repeating: false, disabled: true, deleted: true}
  ]) {
    TCTesting.TestSuite(`(GET) - should return one alert of user by id`, () => {
      let actualAlert: AlertResponse;
      let expectedAlert: AlertDb;
      let expectedAlertDb: AlertDb;
      beforeAll(async () => {
        await fixture.portfolio.deleteAllAlertsOfUser();
        // create test data (alerts for GET)
        expectedAlertDb = await fixture.portfolio.addAlert({
          thresholdValue: getRandom(100, 1000),
          currencyId: currencies.randomElement().id,
          isRepeating: testCase.repeating
        }, testCase.disabled);
      });
      TCTesting.TestCase(`http response code should be 200 OK`, async () => {
        const response = await fixture.alertsApiClient.getAlert(expectedAlertDb.id);
        expect(response.statusCode).toBe(200, response.error);
        actualAlert = response.message;
        expectedAlert = await fixture.portfolio.getAlertOfUser(fixture.defaultUser.id, (value) => {
            return value.id === actualAlert.id;
        });
      });
      TCTesting.TestSuite(`Alert item in response should by correct`, () => {
        let currencyOfAlert: CurrencyTestContext;
        beforeAll(async () => {
          currencyOfAlert = currencies.find((x) => x.id === expectedAlert.currencyId);
        });
        TCTesting.TestCase(`assert id`,
          async () => expect(actualAlert.id).toBe(expectedAlertDb.id));
        TCTesting.TestCase(`assert thresholdValue`,
          async () => expect(actualAlert.thresholdValue).toBe(parseFloat(expectedAlert.value.toString())));
        TCTesting.TestCase(`assert isRepeating`, async () => expect(actualAlert.isRepeating).toBe(expectedAlert.isRepeating));
        TCTesting.TestCase(`assert currency.id`, async () => expect(actualAlert.currency.id).toBe(expectedAlert.currencyId));
        TCTesting.TestCase(`assert currency.ticker`, async () => expect(actualAlert.currency.ticker).toBe(currencyOfAlert.ticker));
        TCTesting.TestCase(`assert currency.name`, async () => expect(actualAlert.currency.name).toBe(currencyOfAlert.name));
        TCTesting.TestCase(`assert currency.priceUsd`,
          async () => expect(actualAlert.currency.priceUsd).toBe(parseFloat(currencyOfAlert.price.toString())));
        TCTesting.TestCase(`assert currency.imageUrl`,
          async () => expect(actualAlert.currency.imageUrl).toBe(fixture.config.api.url + currencyOfAlert.imageUrl));
        TCTesting.TestCase(`assert currency.convertibleIconUrl`,
          async () => expect(actualAlert.currency.convertibleIconUrl)
            .toBe(currencyOfAlert.convertibleIconUrl == null ? null : (fixture.config.api.url + currencyOfAlert.convertibleIconUrl)));
      });
    });
  }

  for (const testCase of [
    {request: {
        thresholdValue: 0,
        isRepeating: true,
        currencyId: '%'
      }},
    {request: {
        thresholdValue: 3500,
        isRepeating: true,
        currencyId: '%'
      }},
    {request: {
        thresholdValue: 0.046545,
        isRepeating: true,
        currencyId: '%'
      }},
    {request: {
        thresholdValue: 1456.45646541,
        isRepeating: true,
        currencyId: '%'
      }}
  ]) {
    TCTesting.TestSuite(`(POST) - should create new alert (value: ${testCase.request.thresholdValue}, repeating: ${testCase.request.isRepeating})`,
      () => {

      const addRequest = testCase.request;
      let response: ApiResponseEmpty;
      let expectedAlert: AlertDb;

      beforeAll(async () => {
        if (addRequest.currencyId.includes('%'))
          addRequest.currencyId = currencies[0].id;

        await fixture.portfolio.deleteAllAlertsOfUser();
      });

      TCTesting.TestCase(`http response code should be 200 OK`, async () => {
        response = await fixture.alertsApiClient.createAlert(addRequest);
        expect(response.statusCode).toBe(200, response.error);
        expectedAlert = await fixture.portfolio.getAlertOfUser();
      });

      TCTesting.TestCase(`assert currencyId`, async () => expect(expectedAlert.currencyId).toBe(addRequest.currencyId));
      TCTesting.TestCase(`assert thresholdValue`, async () => expect(expectedAlert.value).toBe(addRequest.thresholdValue.toString()));
      TCTesting.TestCase(`assert isRepeating`, async () => expect(expectedAlert.isRepeating).toBe(addRequest.isRepeating));
      TCTesting.TestCase(`assert isDeleted`, async () => expect(expectedAlert.isDeleted).toBeFalsy());
      TCTesting.TestCase(`assert isDisabled`, async () => expect(expectedAlert.isDisabled).toBeFalsy());
    });
  }

  for (const testCase of [
    {request: {
        thresholdValue: 1546.423543
      }},
    {request: {
        thresholdValue: 0.4564
      }},
    {request: {
        thresholdValue: 0
      }},
    {request: {
        isRepeating: false
      }},
    {request: {
        isRepeating: true
      }},
    {request: {
        currencyId: '%'
      }},
    {request: {
        thresholdValue: 1561.4564,
        isRepeating: false,
        currencyId: '%'
      }}
  ]) {
    TCTesting.TestSuite(`(PUT) - should update alert ` +
      `(${testCase.request.thresholdValue === undefined ? '' : 'change value: ' + testCase.request.thresholdValue + ', '}` +
      `${testCase.request.isRepeating === undefined ? '' : 'change repeating: ' + testCase.request.isRepeating + ', '}` +
      `${testCase.request.currencyId === undefined ? '' : 'change currency: ' + testCase.request.currencyId})`,
      async () => {

        let oldCurrencyId, updateRequest;
        let oldAlert: AlertDb;
        let expectedAlert: AlertDb;

        beforeAll(async () => {
          oldCurrencyId = currencies[currencies.length - 1].id;
          updateRequest = testCase.request;
          await fixture.portfolio.deleteAllAlertsOfUser();
          // create test data (alert for update)
          await fixture.alertsApiClient.createAlert({
            thresholdValue: 1000,
            isRepeating: updateRequest.isRepeating !== undefined ? !updateRequest.isRepeating : true,
            currencyId: oldCurrencyId
          });
          oldAlert = await fixture.portfolio.getAlertOfUser();
          // form update request for test
          if (updateRequest.thresholdValue === undefined)
            updateRequest['thresholdValue'] = oldAlert.value;

          if (updateRequest.isRepeating === undefined)
            updateRequest['isRepeating'] = oldAlert.isRepeating;

          if (updateRequest.currencyId === undefined) {
            updateRequest['currencyId'] = oldCurrencyId;
          } else {
            if (updateRequest.currencyId.includes('%'))
              updateRequest.currencyId = currencies[0].id;
          }
        });

        TCTesting.TestCase(`http response code should be 200 OK`, async () => {
          const response = await fixture.alertsApiClient.updateAlert(oldAlert.id, updateRequest);
          expect(response.statusCode).toBe(200, response.error);
          expectedAlert = await fixture.portfolio.getAlertOfUser();
        });
        TCTesting.TestCase(`assert currencyId`, async () => expect(expectedAlert.currencyId).toBe(updateRequest.currencyId));
        TCTesting.TestCase(`assert thresholdValue`, async () => expect(expectedAlert.value).toBe(updateRequest.thresholdValue.toString()));
        TCTesting.TestCase(`assert isRepeating`, async () => expect(expectedAlert.isRepeating).toBe(updateRequest.isRepeating));
        TCTesting.TestCase(`assert isDeleted`, async () => expect(expectedAlert.isDeleted).toBeFalsy());
        TCTesting.TestCase(`assert isDisabled`, async () => expect(expectedAlert.isDisabled).toBeFalsy());
      });
  }

  for (const testCase of [
    {oldAlert: {isDisabled: false}, testMode: {enable: false}},
    {oldAlert: {isDisabled: true}, testMode: {enable: false}},
    {oldAlert: {isDisabled: true}, testMode: {enable: true}},
    {oldAlert: {isDisabled: false}, testMode: {enable: true}}
  ]) {
    TCTesting.TestSuite(`(PUT) - should ${testCase.testMode.enable ? 'enable' : 'disable'}` +
      ` alert when it ${testCase.oldAlert.isDisabled ? 'enabled' : 'disabled'}`,
      () => {
      let oldAlert: AlertDb;
      let expectedAlert: AlertDb;
      beforeAll(async () => {
        await fixture.portfolio.deleteAllAlertsOfUser();
        // create test data (alert for update)
        await fixture.alertsApiClient.createAlert({
          thresholdValue: 1000,
          isRepeating: true,
          currencyId: currencies[currencies.length - 1].id
        });
        oldAlert = await fixture.portfolio.getAlertOfUser();
        await fixture.portfolio.alertsService.changeAlertActiveState(oldAlert.id, testCase.oldAlert.isDisabled);
      });

      TCTesting.TestCase(`http response code should be 200 OK`, async () => {
        let response;
        if (testCase.testMode.enable) {
          response = await fixture.alertsApiClient.enableAlert(oldAlert.id);
        } else {
          response = await fixture.alertsApiClient.disableAlert(oldAlert.id);
        }
        expect(response.statusCode).toBe(200, response.error);
        expectedAlert = await fixture.portfolio.getAlertOfUser();
      });
      TCTesting.TestCase(`assert currencyId`, async () => expect(expectedAlert.currencyId).toBe(oldAlert.currencyId));
      TCTesting.TestCase(`assert thresholdValue`, async () => expect(expectedAlert.value).toBe(oldAlert.value));
      TCTesting.TestCase(`assert isRepeating`, async () => expect(expectedAlert.isRepeating).toBe(oldAlert.isRepeating));
      TCTesting.TestCase(`assert isDeleted`, async () => expect(expectedAlert.isDeleted).toBeFalsy());
      if (testCase.testMode.enable) {
        TCTesting.TestCase(`assert isDisabled`, async () => expect(expectedAlert.isDisabled).toBeFalsy());
      } else {
        TCTesting.TestCase(`assert isDisabled`, async () => expect(expectedAlert.isDisabled).toBeTruthy());
      }
    });
  }

  for (const testCase of [
    {}
  ]) {
    TCTesting.TestSuite(`(DELETE) - should mark alert as deleted`, () => {
      let oldAlert: AlertDb;
      let expectedAlert: AlertDb;
      beforeAll(async () => {
        await fixture.portfolio.deleteAllAlertsOfUser();
        // create test data (alert for delete)
        await fixture.alertsApiClient.createAlert({
          thresholdValue: 1000,
          isRepeating: true,
          currencyId: currencies[0].id
        });
        oldAlert = await fixture.portfolio.getAlertOfUser();
      });
      TCTesting.TestCase(`http response code should be 200 OK`, async () => {
        const response = await fixture.alertsApiClient.deleteAlert(oldAlert.id);
        expect(response.statusCode).toBe(200, response.error);
        expectedAlert = await fixture.portfolio.getAlertOfUser();
      });
      TCTesting.TestCase(`assert isDeleted`, async () => expect(expectedAlert.isDeleted).toBeTruthy());
    });
  }

  for (const testCase of [
    {take: 5, skip: 0},
    {take: 5, skip: 5}
  ]) {
    TCTesting.TestSuite(`(GET) - should return ${testCase.take} notifications of user and skip ${testCase.skip}`, () => {
      const testMetaData = {
        alerts: [
          {disabled: false, deleted: false, notifications: [
              {readed: false, days: 2},
              {readed: false, days: 2},
              {readed: false, days: 2},
              {readed: false, days: 1},
              {readed: false, days: 1},
              {readed: false, days: 1},
              {readed: false, days: 0},
              {readed: false, days: 0}
            ]},
          {disabled: false, deleted: false, notifications: [
              {readed: false, days: 3},
              {readed: false, days: 3},
              {readed: false, days: 3},
              {readed: false, days: 2},
              {readed: false, days: 2},
              {readed: false, days: 2},
              {readed: false, days: 1},
              {readed: false, days: 1},
              {readed: false, days: 1},
              {readed: false, days: 0},
              {readed: false, days: 0}
            ]},
          {disabled: true, deleted: false, notifications: [
              {readed: false, days: 2},
              {readed: false, days: 1}
            ]},
          {disabled: false, deleted: false, notifications: [
              {readed: false, days: 1},
              {readed: false, days: 1},
              {readed: false, days: 1},
              {readed: false, days: 0},
              {readed: false, days: 0}
            ]},
          {disabled: false, deleted: true, notifications: [
              {readed: false, days: 1},
              {readed: false, days: 0},
              {readed: false, days: 0}
            ]}
        ]};
      let notifications: CollectionResponse<AlertNotificationsResponse>;
      let expectedNotifications: NotificationDb[];
      beforeAll(async () => {
        await fixture.portfolio.deleteAllAlertsOfUser();
        for (const alertMetaData of testMetaData.alerts) {
          const alert = await fixture.portfolio.addAlert({
            thresholdValue: getRandom(100, 1000),
            currencyId: currencies.randomElement().id,
            isRepeating: true
          }, alertMetaData.disabled, alertMetaData.deleted);
          for (const notifyMetaData of alertMetaData.notifications) {
            await fixture.portfolio.addNotification(alert, notifyMetaData.readed, notifyMetaData.days);
          }
        }
      });
      TCTesting.TestCase(`http response code should be 200 OK`, async () => {
        const response = await fixture.alertsApiClient.getNotifications(testCase.take, testCase.skip);
        expect(response.statusCode).toBe(200, response.error);
        notifications = response.message;
        const all = await fixture.portfolio.getNotificationsOfUser();
        expectedNotifications = all.slice(testCase.skip, testCase.take + testCase.skip);
      });
      TCTesting.TestCase(`count of items in response should by correct`, async () =>
        expect(notifications.items.length).toBe(expectedNotifications.length));
      TCTesting.TestSuite(`Notification items in response should by correct`, () => {
        for (let i = 0; i < testCase.take; i++) {
          let notificationsResponse: AlertNotificationsResponse;
          let currencyOfNotification: CurrencyTestContext;
          beforeAll(async () => {
            notificationsResponse = notifications.items.find((x) => x.id === expectedNotifications[i].id);
            currencyOfNotification = currencies.find((x) => x.id === expectedNotifications[i].currencyId);
          });
          // testMetaData.alerts.forEach((a) => {
          //   notificationMetaData.push(a.notifications);
          // });
          // notificationMetaData = notificationMetaData.slice(testCase.skip, testCase.take);
          const notificationsMetaData = testMetaData.alerts
            .reduceRight((accumulator, currentValue, idx, arr) => {
            for (const n of currentValue.notifications) {
              accumulator.push({notify: n, deleted: currentValue.deleted, disabled: currentValue.disabled});
            }
            return accumulator;
            }, [])
            .sort((a, b) => { return a.notify.days - b.notify.days; })
            .slice(testCase.skip, testCase.take + testCase.skip);
          TCTesting.TestCase(`notify N${i} (deleted=${notificationsMetaData[i].deleted}, disabled=${notificationsMetaData[i].disabled}) ` +
            `should be exist in response`, async () => {
            expect(notificationsResponse).not.toBeUndefined();
          });
          TCTesting.TestCase(`assert id`,
            async () => expect(notificationsResponse.id).toBe(expectedNotifications[i].id));
          TCTesting.TestCase(`assert value`,
            async () => expect(notificationsResponse.value).toBe(parseFloat(expectedNotifications[i].value.toString())));
          TCTesting.TestCase(`assert currencyUsdPrice`,
            async () => expect(notificationsResponse.currencyUsdPrice).toBe(parseFloat(expectedNotifications[i].currencyUsdPrice.toString())));

          TCTesting.TestCase(`assert date`,
            // @ts-ignore
            async () => expect(notificationsResponse.date).toMatch(new RegExp(expectedNotifications[i].date.toPostgrePatternString())));
          TCTesting.TestCase(`assert isRead`, async () => expect(notificationsResponse.isRead).toBe(expectedNotifications[i].isRead));
          TCTesting.TestCase(`assert currency.id`, async () => expect(notificationsResponse.currency.id).toBe(expectedNotifications[i].currencyId));
          TCTesting.TestCase(`assert currency.ticker`, async () => expect(notificationsResponse.currency.ticker).toBe(currencyOfNotification.ticker));
          TCTesting.TestCase(`assert currency.name`, async () => expect(notificationsResponse.currency.name).toBe(currencyOfNotification.name));
          TCTesting.TestCase(`assert currency.priceUsd`,
            async () => expect(notificationsResponse.currency.priceUsd).toBe(parseFloat(currencyOfNotification.price.toString())));
          TCTesting.TestCase(`assert currency.imageUrl`,
            async () => expect(notificationsResponse.currency.imageUrl).toBe(fixture.config.api.url + currencyOfNotification.imageUrl));
          TCTesting.TestCase(`assert currency.convertibleIconUrl`,
            async () => expect(notificationsResponse.currency.convertibleIconUrl)
              .toBe(currencyOfNotification.convertibleIconUrl == null ? null : (fixture.config.api.url + currencyOfNotification.convertibleIconUrl)));
        }
      });
    });
  }

  TCTesting.TestSuite('401 Unauthorized test suite', () => {
    let someAlert: AlertDb;
    beforeAll(async () => {
      await fixture.portfolio.deleteAllAlertsOfUser();
      someAlert = await fixture.portfolio.addAlert({
        thresholdValue: getRandom(100, 1000),
        currencyId: currencies.randomElement().id,
        isRepeating: true
      });
      await fixture.portfolio.addNotification(someAlert);
      await fixture.logout();
    });
    afterAll(async () => {
      await fixture.relogin(fixture.defaultUser);
      await fixture.portfolio.deleteAllAlertsOfUser();
    });

    TCTesting.TestCase('(GET) Alerts should return error, when token was not received', async () => {
      const response = await fixture.alertsApiClient.getAlerts();
      expect(response.statusCode).toBe(401);
      expect(response.error).toBe('', 'response should be empty');
    });

    TCTesting.TestCase('(GET) Notifications should return error, when token was not received', async () => {
      const response = await fixture.alertsApiClient.getNotifications(10, 0);
      expect(response.statusCode).toBe(401);
      expect(response.error).toBe('', 'response should be empty');
    });

    TCTesting.TestCase('(GET) Alert by id should return error, when token was not received', async () => {
      const response = await fixture.alertsApiClient.getAlert(someAlert.id);
      expect(response.statusCode).toBe(401);
      expect(response.error).toBe('', 'response should be empty');
    });

    TCTesting.TestCase('(POST) Alert should return error, when token was not received', async () => {
      const response = await fixture.alertsApiClient.createAlert({
        thresholdValue: 123.43,
        isRepeating: true,
        currencyId: currencies[0].id
      });
      expect(response.statusCode).toBe(401);
      expect(response.error).toBeUndefined();
    });

    TCTesting.TestCase('(PUT) Alert should return error, when token was not received', async () => {
      const response = await fixture.alertsApiClient.updateAlert(someAlert.id, {
        thresholdValue: 123.43,
        isRepeating: true,
        currencyId: currencies[0].id
      });
      expect(response.statusCode).toBe(401);
      expect(response.error).toBeUndefined();
    });

    TCTesting.TestCase('(PUT) Disable alert should return error, when token was not received', async () => {
      const response = await fixture.alertsApiClient.disableAlert(someAlert.id);
      expect(response.statusCode).toBe(401);
      expect(response.error).toBe('', 'response should be empty');
    });

    TCTesting.TestCase('(PUT) Enable alert should return error, when token was not received', async () => {
      const response = await fixture.alertsApiClient.enableAlert(someAlert.id);
      expect(response.statusCode).toBe(401);
      expect(response.error).toBe('', 'response should be empty');
    });

    TCTesting.TestCase('(DELETE) Delete alert should return error, when token was not received', async () => {
      const response = await fixture.alertsApiClient.deleteAlert(someAlert.id);
      expect(response.statusCode).toBe(401);
      expect(response.error).toBe('', 'response should be empty');
    });
  });
});

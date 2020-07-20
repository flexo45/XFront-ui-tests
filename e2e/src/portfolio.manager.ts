import {DbClient} from './data-access/db.client';
import {ExchangeConfig, WalletConfig} from './test.conf';
import {AppTestFixture, CurrencyTestContext, DepositoryTestContext} from './app.test-fixture';
import {DepositoryState} from './data-access/db.depositories';
import {CurrenciesService} from './currencies.service';
import {DepositoriesService} from './depositories.service';
import {DeltaValue} from '../../src/app/portfolio/delta-value/delta-value';
import {getRandom} from './utils';
import './extantions/array.extansion';
import {AlertDb, DepositoryResponseModel, NotificationDb} from './data-access/db.model';
import {DbAlerts} from './data-access/db.alerts';
import {AlertsService} from './alerts.service';
import {AlertUpdateRequest} from '../../src/app/api/models/alert-update-request';

export class PortfolioManager {

  private _apiClient;
  private testContext;
  private dbDepositories;
  private dbCurrencies;
  private dbAlerts;

  public currenciesService: CurrenciesService;
  public depositoriesService: DepositoriesService;
  public alertsService: AlertsService;

  constructor(private fixture: AppTestFixture) {
    this._apiClient = fixture._apiClient;
    this.testContext = fixture.testContext;
    this.dbDepositories = fixture.dbDepositories;
    this.dbCurrencies = fixture.dbCurrencies;
    this.dbAlerts = new DbAlerts();
    this.currenciesService = new CurrenciesService(fixture.dbCurrencies);
    this.depositoriesService = new DepositoriesService(fixture.dbDepositories);
    this.alertsService = new AlertsService(this.dbAlerts);
  }

  public async dispose() {
    await DbClient.getInstance().dispose();
  }

  public async getBalanceDeltaValueForPeriod(currencyTicker: string, period: string = '1D'): Promise<DeltaValue> {
    const delta = await this.dbCurrencies.getDeltaOfPriceByPeriod(currencyTicker, period);
    return new DeltaValue(parseFloat(delta), 0);
  }

  public async getDepositoriesOfUser(
    userId: string = this.fixture.testContext.user.id,
    filter?: (value: DepositoryResponseModel, index: number, obj: DepositoryResponseModel[]) => boolean)
    : Promise<DepositoryResponseModel[]> {
    const list = await this.depositoriesService.getDepositoryList(userId);
    if (filter)
      return list.filter(filter);

    return list;
  }

  public async getDepositoryOfUser(
    userId: string = this.fixture.testContext.user.id,
    find?: (value: DepositoryResponseModel, index: number, obj: DepositoryResponseModel[]) => boolean)
    : Promise<DepositoryResponseModel> {
    const list = await this.depositoriesService.getDepositoryList(userId);
    if (find)
      return list.find(find);

    return list.shift();
  }

  public async convertPrice(currencyTicker: string, convertibleName: string): Promise<number> {
    return parseFloat(await this.dbCurrencies.getCurrencyPriceInConvertible(currencyTicker, convertibleName));
  }

  public async convertToUsdPrice(currencyTicker: string): Promise<number> {
    return await this.convertPrice(currencyTicker, 'USD');
  }

  public async deleteAllDepositoriesOfUser(userId: string = this.fixture.testContext.user.id) {
    await this.dbDepositories.deleteAllDepositoryByUserId(userId);
    this.testContext.user.depositories = [];
  }

  public async deleteAllDepositoriesOfExchange(exchange: ExchangeConfig) {
    await this.dbDepositories.deleteAllDepositoryByApiKey(exchange.public);
    await this.testContext.user.removeExchange(exchange.id);
  }

  public async addExchangeToUser(config: ExchangeConfig, userId: string = this.fixture.testContext.user.id): Promise<DepositoryTestContext> {
    let depositoryTestContext: DepositoryTestContext;
    const depositoryId = await this.depositoriesService.getExchangeId(config.public);
    if (depositoryId) {
      await this.depositoriesService.createUserDepository(userId, config.name, depositoryId);
      const depository = await this.getDepositoryOfUser(userId, x => x.exchangePublicKey === config.public);
      depositoryTestContext = {
        id: depository.id,
        name: depository.name,
        exchange: depository.exchange,
        blockchain: depository.blockchain,
        currencies: []
      }
    } else {
      depositoryTestContext = await this.depositoriesService.attachExchangeToUser(userId, {
        exchange: config.id,
        name: config.name,
        apiKey: config.public,
        apiSecret: config.secret,
        apiPassphrase: config.passphrase
      });
    }
    await this.fillTestContextIfBalanceExist(depositoryTestContext);
    this.testContext.user.addDepository(depositoryTestContext);
    return depositoryTestContext;
  }

  public async addWalletToUser(config: WalletConfig, userId: string = this.fixture.testContext.user.id): Promise<DepositoryTestContext> {
    let depositoryTestContext: DepositoryTestContext;
    const depositoryId = await this.depositoriesService.getWalletId(config.address);
    if (depositoryId) {
      await this.depositoriesService.createUserDepository(userId, config.name, depositoryId);
      const depository = await this.getDepositoryOfUser(userId, x => x.addressInBlockchain === config.address);
      depositoryTestContext = {
        id: depository.id,
        name: depository.name,
        exchange: depository.exchange,
        blockchain: depository.blockchain,
        currencies: []
      }
    } else {
      depositoryTestContext = await this.depositoriesService.attachWalletToUser(userId, {
        blockchain: config.id,
        name: config.name,
        addressInBlockchain: config.address
      });
    }
    await this.fillTestContextIfBalanceExist(depositoryTestContext);
    this.testContext.user.addDepository(depositoryTestContext);
    return depositoryTestContext;
  }

  public async addCurrenciesToDepository(depository: DepositoryTestContext,
                                         currencies: {currency: CurrencyTestContext, amount: number}[]) {
    await this.dbDepositories.addCurrenciesBalancesToDepository(depository.id, currencies.map((x) => [x.currency.id, x.amount]) as [string, number][]);
    for (const currency of currencies) {
      await this.testContext.user.addCurrencyToDepository(currency.currency, currency.amount, depository);
    }
  }

  public async addSomeCurrenciesToDepository(depository: DepositoryTestContext) {
    const currencies = await this.dbCurrencies.getSomeCurrencies(10);
    const currenciesForDepository = currencies.randomElements(3) as CurrencyTestContext[];

    // debug logging start
    console.log(`Currencies for depository id: ${depository.id}, name: ${depository.name}`);
    currenciesForDepository.forEach((x) => {
      if (x === undefined) {
        console.log('undefined currencies found');
      } else {
        console.log(x.id, x.name);
      }
    });
    // debug logging end

    const currenciesWithAmounts = currenciesForDepository.map((x) => {
      if (x !== undefined) {
        const amount = getRandom(10, 100);
        return { currency: x, amount: amount };
      }
    });
    await this.addCurrenciesToDepository(depository, currenciesWithAmounts);
  }

  public async addSomeDepositoriesWithCoinsToUser(exchanges: ExchangeConfig[], wallets: WalletConfig[], userId: string = this.fixture.testContext.user.id) {
    if (exchanges !== null && exchanges.length > 0) {
      for (const exchange of exchanges) {

        const depositoryTestContext = await this.addExchangeToUser(exchange, userId);

        if (depositoryTestContext.currencies.length === 0) {
          await this.addSomeCurrenciesToDepository(depositoryTestContext);
          await this.changeDepositoryState(depositoryTestContext.id, DepositoryState.Ok);
        }
      }
    }
    if (wallets !== null && wallets.length > 0) {
      for (const wallet of wallets) {

        const depositoryTestContext = await this.addWalletToUser(wallet, userId);

        if (depositoryTestContext.currencies.length === 0) {
          await this.addSomeCurrenciesToDepository(depositoryTestContext);
          await this.changeDepositoryState(depositoryTestContext.id, DepositoryState.Ok);
        }
      }
    }
  }

  public async changeDepositoryState(userDepositoryId: string, state: DepositoryState) {
    await this.dbDepositories.updateStateOfDepository(userDepositoryId, state);
  }

  public async getAlertsOfUser(userId: string = this.fixture.testContext.user.id,
                               filter?: (value: AlertDb, index: number, obj: AlertDb[]) => boolean): Promise<AlertDb[]> {
    const list = await this.alertsService.getAlertsListOfUser(userId);
    if (filter)
      return list.filter(filter);

    return list;
  }

  public async getNotificationsOfUser(userId: string = this.fixture.testContext.user.id,
                                      filter?: (value: NotificationDb, index: number, obj: NotificationDb[]) => boolean
                                      ): Promise<NotificationDb[]> {
    const notifications = await this.alertsService.getNotificationsOfUser(userId);

    if (filter)
      return notifications.filter(filter);

    return notifications;
  }

  public async getAlertOfUser(
    userId: string = this.fixture.testContext.user.id,
    find?: (value: AlertDb, index: number, obj: AlertDb[]) => boolean)
    : Promise<AlertDb> {
    const list = await this.alertsService.getAlertsListOfUser(userId);
    if (find)
      return list.find(find);

    return list.shift();
  }

  public async deleteAllAlertsOfUser(
    userId: string = this.fixture.testContext.user.id
  ) {
    await this.alertsService.deleteAllAlertsOfUser(userId);
  }

  public async addAlert(
    alert: AlertUpdateRequest,
    isDisabled: boolean = false,
    isDeleted: boolean = false,
    userId: string = this.fixture.testContext.user.id
  ): Promise<AlertDb> {
    return await this.alertsService.createAlertOfUser(alert, isDisabled, isDeleted, userId);
  }

  public async addNotification(alert: AlertDb, isRead: boolean = false, daysAgo: number = 0): Promise<string> {
    const currencyOfAlert = await this.currenciesService.getCurrencyById(alert.currencyId);
    return await this.alertsService.createNotificationForUser(alert, currencyOfAlert.price, isRead, daysAgo);
  }

  private async fillTestContextIfBalanceExist(depositoryTestContext: DepositoryTestContext) {
    const depositoryBalanceIfExist = await this.dbDepositories.selectCurrenciesOfDepository(depositoryTestContext.id);

    if (depositoryBalanceIfExist.length > 0) {
      depositoryBalanceIfExist.forEach((x) => {

        this.testContext.user.addCurrencyToDepository({
          id: x.id,
          name: x.name,
          ticker: x.ticker,
          price: x.priceUsd
        }, x.amount, depositoryTestContext);
      });
    }
  }
}

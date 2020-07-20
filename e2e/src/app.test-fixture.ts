import {ExchangeConfig, TestConf, WalletConfig} from './test.conf';
import {IdentityModel} from './app/identity.model';
import {ApiClient} from './app/api.client';
import {AttachWalletDepositoryAppPage, Blockchain} from './app/app.attach-wallet.po';
import {AppPageObject} from './app/app.base.po';
import {WelcomeAppPage} from './app/app.welcome.po';
import {SignInAppPage} from './app/identity.signin.po';
import {browser} from 'protractor';
import {AttachExchangeDepositoryAppPage, Exchanges} from './app/app.attach-exchange.po';
import {CurrenciesAppPage} from './app/app.currencies.po';
import {DepositoriesAppPage} from './app/app.depositories.po';
import {DepositoriesApiClient} from './api/depositories.api-client';
import {DbDepositories} from './data-access/db.depositories';
import {DbCurrencies} from './data-access/db.currencies';
import {DbClient} from './data-access/db.client';
import {PortfolioManager} from './portfolio.manager';
import {AlertsApiClient} from './api/alerts.api-client';

export class AppTestFixture {

  public defaultUser: {id: string, login: string, password: string, username: string};
  public defaultExchange: ExchangeConfig;
  public testContext: TestContext;
  public portfolio: PortfolioManager;

  constructor(public config: TestConf = new TestConf(),
              public page: AppPageObject = new AppPageObject(),
              public welcome: WelcomeAppPage = new WelcomeAppPage(),
              public attachWallet: AttachWalletDepositoryAppPage = new AttachWalletDepositoryAppPage(),
              public attachExchange: AttachExchangeDepositoryAppPage = new AttachExchangeDepositoryAppPage(),
              public depositories: DepositoriesAppPage = new DepositoriesAppPage(),
              public identity: IdentityModel = new IdentityModel(new SignInAppPage()),
              public currencies: CurrenciesAppPage = new CurrenciesAppPage(),
              public _apiClient: ApiClient = new ApiClient(config.api.url),
              public depositoryApiClient: DepositoriesApiClient = new DepositoriesApiClient(),
              public alertsApiClient: AlertsApiClient = new AlertsApiClient(),
              public dbDepositories: DbDepositories = new DbDepositories(),
              public dbCurrencies: DbCurrencies = new DbCurrencies()
  ) {

    this.defaultUser = config.users.default;
    this.defaultExchange = config.exchanges.binance;
    this.testContext = new TestContext(new UserTestContext(this.defaultUser.login, this.defaultUser.password, this.defaultUser.id, []));
    this.portfolio = new PortfolioManager(this);
  }

  public async dispose() {
    await DbClient.getInstance().dispose();
  }

  public async relogin(user: {id: string, login: string, password: string, username: string}) {
    await this.logout();
    await this.identity.login(user.login, user.password);
    this.testContext.user = new UserTestContext(user.login, user.password, user.id, []);
  }

  public async logout() {
    await this.page.navigateToRoot();
    await browser.sleep(2000);
    if (await this.page.signOutText.base.el.isPresent()) {
      await this.page.signOutText.click();
    }
    this.testContext.user = null;
  }

  public async __prepareTestDataInDb() {

    this.config.currencies.testing.currencyIdNoHistory = await this.dbCurrencies.createCurrency({
      name: 'TC No History',
      ticker: 'TCNH',
      price: 0.0136454543446,
      history: [
      ]
    });

    this.config.currencies.testing.currencyIdTooLowDelta = await this.dbCurrencies.createCurrency({
      name: 'TC Too low delta',
      ticker: 'TCTLD',
      price: 11545645456465160e-19,
      history: [
        11545645456465162e-19,
        11545645456465161e-19
      ]
    });

    const normalCurrencyId = await this.dbCurrencies.createCurrency({
      name: 'TC Normal',
      ticker: 'TCN123',
      price: 1154564545646516e-18,
      history: [
        5464364564564546e-18,
        3154564545646516e-18
      ]
    });

    this.config.currencies.testing.currenciesIdNormal.push(normalCurrencyId);
  }

  public async addExchanges(exchangesCount: number, userId: string = this.testContext.user.id) {
    const exchanges: ExchangeConfig[] = [];
    for (let i = 0; i < exchangesCount; i++) {
      exchanges.push({
        id: Exchanges.Binance,
        public: `testPublicKey${i}${userId}`,
        secret: `testSecretKey${i}${userId}`,
        name: `testNameE${i}`
      });
    }
    await this.portfolio.addSomeDepositoriesWithCoinsToUser(exchanges, [], userId);
  }

  public async addWallets(walletsCount: number, userId: string = this.testContext.user.id) {
    const wallets: WalletConfig[] = [];
    for (let i = 0; i < walletsCount; i++) {
      wallets.push({
        id: Blockchain.Bitcoin,
        address: this.config.addresses.bitcoin[i],
        name: `testNameW${i}`
      });
    }
    await this.portfolio.addSomeDepositoriesWithCoinsToUser([], wallets, userId);
  }
}

class TestContext {
  constructor(public user: UserTestContext) {
  }
}

class UserTestContext {
  constructor(public login: string,
    public password: string,
    public id: string,
    public depositories: DepositoryTestContext[] = [],
    public currencies: {currency: CurrencyTestContext, amount: number}[] = []) {
  }

  public getExchange(exchange: Exchanges): DepositoryTestContext {
    const result = this.depositories.filter((x) => x.exchange === exchange );
    return result[0];
  }

  public addDepository(depository: DepositoryTestContext) {
    const existed = this.depositories.find((x) => x.id === depository.id);
    if (existed === undefined) {
      this.depositories.push(depository);
    }
  }

  public addCurrencyToDepository(currency: CurrencyTestContext, amount: number, depository: DepositoryTestContext) {
    depository.currencies.push({currency: currency, amount: amount});
    const existed = this.currencies.find((x) => x.currency.id === currency.id);
    if (existed === undefined) {
      this.currencies.push({currency: currency, amount: amount});
    } else {
      existed.amount += amount;
    }
  }

  public removeExchange(exchange: Exchanges) {
    this.depositories = this.depositories.filter((x) => x.exchange !== exchange );
  }

  public removeWallet(wallet: Blockchain) {
    this.depositories = this.depositories.filter((x) => x.blockchain !== wallet );
  }
}

export class DepositoryTestContext {
  id: string;
  name: string;
  exchange?: Exchanges;
  blockchain?: Blockchain;
  currencies: {currency: CurrencyTestContext, amount: number}[];
}

export class CurrencyTestContext {
  id: string;
  name: string;
  ticker: string;
  price: number;
  imageUrl?: string;
  convertibleIconUrl?: string;
}

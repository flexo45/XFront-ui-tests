import {AppTestFixture, DepositoryTestContext} from '../app.test-fixture';
import {TestsBase} from './attach.exchange';
import {DepositoryAppPage} from '../app/app.depository.po';
import {ExchangeConfig, WalletConfig} from '../test.conf';
import {Exchanges} from '../app/app.attach-exchange.po';
import {Blockchain} from '../app/app.attach-wallet.po';
import {DepositoryState} from '../data-access/db.depositories';

export class DepositoriesTests extends TestsBase {

  private defaultExchange: ExchangeConfig;

  constructor(fixture: AppTestFixture) {
    super(fixture);
    this.defaultExchange = this.fixture.config.exchanges.binance;
  }

  public async SwitchToCurrencyTest(currencyName: string, deltaMode: string) {
    const portfolioDepositories = this.fixture.depositories;
    // Arrange
    await portfolioDepositories.navigateTo();
    await portfolioDepositories.balanceHeader.deltaPeriodSelector.switchToPeriod('1D');
    await portfolioDepositories.switchDeltaMode(deltaMode);
  }

  public async SwitchToCurrenciesBalanceIconTest(currencyName: string) {
    const portfolioDepositories = this.fixture.depositories;
    for (let i = 0; i < await portfolioDepositories.depositoryList.getRowCount(); i++) {
      await portfolioDepositories.depositoryList.getRow(i + 1)
        .balanceColumn.balanceAmount.currencyIcon.assertRegularSvgIcon(currencyName);
    }
  }

  public async SwitchToCurrenciesBalanceDeltaIconTest(currencyName: string) {
    const portfolioDepositories = this.fixture.depositories;
    for (let i = 0; i < await portfolioDepositories.depositoryList.getRowCount(); i++) {
      if (await portfolioDepositories.depositoryList.getRow(i + 1).balanceColumn.balanceDeltaValue.base.el.isPresent()) {
        await portfolioDepositories.depositoryList.getRow(i + 1)
          .balanceColumn.balanceDeltaValue.absolute.currencyIcon.assertSvgIcon(currencyName);
      }
    }
  }

  public async NavigationToDepositoryFromList() {
    // Arrange
    const depositories = this.fixture.depositories;
    await depositories.navigateTo();
    // Act
    const depository = await depositories.depositoryList.getRow(1).clickAndGetDepositoryPage();
    // Assert
    await depository.assertPageLoaded();
  }

  public async NavigationBackToList() {
    // Act
    await new DepositoryAppPage('', '').backArrow.click();
    // Assert
    await this.fixture.depositories.assertPageLoaded();
  }

  public async DepositoryExchangeLimitTest(existedDepositories: number) {
    const depositories = this.fixture.depositories;
    // Arrange
    const exchanges: ExchangeConfig[] = [];
    for (let i = 0; i < existedDepositories; i++) {
      exchanges.push({
        id: Exchanges.Binance,
        public: `testPublicKey${i}`,
        secret: `testSecretKey${i}`,
        name: `testNameE${i}`
      });
    }
    await this.fixture.portfolio.addSomeDepositoriesWithCoinsToUser(exchanges, []);
    // Act
    await depositories.navigateTo();
  }

  public async DepositoryBlockchainLimitTest(existedDepositories: number) {
    const depositories = this.fixture.depositories;
    // Arrange
    const wallets: WalletConfig[] = [];
    for (let i = 0; i < existedDepositories; i++) {
      wallets.push({
        id: Blockchain.Bitcoin,
        address: this.fixture.config.addresses.bitcoin[i],
        name: `testNameW${i}`
      });
    }
    await this.fixture.portfolio.addSomeDepositoriesWithCoinsToUser([], wallets);
    // Act
    await depositories.navigateTo();
  }

  public async DisplayPortfolioEmptyButInProgress(): Promise<DepositoryTestContext> {
    await this.fixture.relogin(this.fixture.defaultUser);
    await this.fixture.portfolio.deleteAllDepositoriesOfUser();
    return await this.fixture.portfolio.addExchangeToUser(this.defaultExchange);
  }

  public async DisplayPortfolioEmpty(): Promise<DepositoryTestContext> {
    await this.fixture.relogin(this.fixture.defaultUser);
    await this.fixture.portfolio.deleteAllDepositoriesOfUser();
    const exchange = await this.fixture.portfolio.addExchangeToUser(this.defaultExchange);
    await this.fixture.portfolio.changeDepositoryState(exchange.id, DepositoryState.Ok);
    return exchange;
  }

}

import {AppTestFixture} from '../app.test-fixture';
import {ExchangeConfig} from '../test.conf';
import {TestsBase} from './attach.exchange';
import {CurrencyPageObjectApp} from '../app/app.currency.po';

export class CurrenciesTests extends TestsBase {

  private defaultExchange: ExchangeConfig;

  constructor(fixture: AppTestFixture) {
    super(fixture);
    this.defaultExchange = this.fixture.config.exchanges.binance;
  }
  //
  // const currencies = await this.fixture.appData.getSomeCurrencies(1);
  // await this.fixture.appData.addCurrenciesBalancesToDepository(response.id, [currencies[0].Id, 100]);

  public async DisplayPortfolioEmptyButInProgress() {
    const portfolioCurrencies = this.fixture.currencies;
    this.fixture.defaultUser = this.fixture.config.users.empty;
    await this.fixture.relogin(this.fixture.defaultUser);
    await this.fixture.portfolio.deleteAllDepositoriesOfUser();

    await this.fixture._apiClient.createExchangeDepository({
      exchange: this.defaultExchange.id,
      name: this.defaultExchange.name,
      apiKey: this.defaultExchange.public,
      apiSecret: this.defaultExchange.secret
    });
    await portfolioCurrencies.navigateTo();
    // Assert
    await portfolioCurrencies.syncingStateView.title.assertIsPresented();
    await portfolioCurrencies.syncingStateView.title.assertText();
    await portfolioCurrencies.syncingStateView.title.assertStyle();

    await portfolioCurrencies.syncingStateView.syncing.assertIsPresented();
    await portfolioCurrencies.syncingStateView.syncing.assertStyle();
    await expect(await portfolioCurrencies.syncingStateView.syncing.el.getText()).toContain('Syncing');

    await portfolioCurrencies.syncingStateView.description.assertIsPresented();
    await portfolioCurrencies.syncingStateView.description.assertText();
    await portfolioCurrencies.syncingStateView.description.assertStyle();
  }

  public async SwitchToCurrencyTest(currencyName: string, deltaMode: string) {
    const portfolioCurrencies = this.fixture.currencies;
    // Arrange
    await portfolioCurrencies.navigateTo();
    await portfolioCurrencies.balanceHeader.deltaPeriodSelector.switchToPeriod('1D');
    await portfolioCurrencies.switchDeltaMode(deltaMode);
  }

  public async SwitchToCurrenciesAmountIconTest(currencyName: string) {
    const portfolioCurrencies = this.fixture.currencies;
    for (let i = 0; i < await portfolioCurrencies.currenciesList.getRowCount(); i++) {
      await portfolioCurrencies.currenciesList.getRow(i + 1)
        .balanceColumn.balanceAmount.currencyIcon.assertRegularSvgIcon(currencyName);
    }
  }

  public async SwitchToCurrenciesPricesIconTest(currencyName: string) {
    const portfolioCurrencies = this.fixture.currencies;
    for (let i = 0; i < await portfolioCurrencies.currenciesList.getRowCount(); i++) {
      await portfolioCurrencies.currenciesList.getRow(i + 1).priceColumn.priceAmount.currencyIcon.assertSvgIcon(currencyName);
    }
  }

  public async SwitchToCurrenciesPriceDeltasIconTest(currencyName: string) {
    const portfolioCurrencies = this.fixture.currencies;
    for (let i = 0; i < await portfolioCurrencies.currenciesList.getRowCount(); i++) {
      // if (await portfolioCurrencies.currenciesList.getRow(i + 1).balanceColumn.balanceDeltaValue.base.el.isPresent()) {
      //
      // }
      await portfolioCurrencies.currenciesList.getRow(i + 1)
        .priceColumn.priceDeltaValue.absolute.currencyIcon.assertSvgIcon(currencyName);
    }
  }

  public async NavigationToCurrency() {
    const currencies = this.fixture.currencies;
    await currencies.navigateTo();
    // Act
    await currencies.currenciesList.getRow(1).click();
    // Assert
    await new CurrencyPageObjectApp('', '').assertPageLoaded();
  }
}

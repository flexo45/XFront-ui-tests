import {browser} from 'protractor';
import {AppTestFixture} from '../../app.test-fixture';
import {CurrenciesTests} from '../../tests/currencies.tests';
import {DepositoryState} from '../../data-access/db.depositories';

describe('XFront App - Currencies test suite', async () => {

  const fixture: AppTestFixture = new AppTestFixture();

  const testSuite: CurrenciesTests = new CurrenciesTests(fixture);

  const portfolioCurrencies = fixture.currencies;

  beforeAll(async () => {
    await fixture.relogin(fixture.defaultUser);
    await fixture.portfolio.deleteAllDepositoriesOfUser();
    await fixture.portfolio.addSomeDepositoriesWithCoinsToUser([fixture.config.exchanges.binance, fixture.config.exchanges.bitmex], []);
  });

  afterEach(async () => {
    if (fixture.defaultUser.login === fixture.config.users.empty.login) {
      await fixture.portfolio.deleteAllDepositoriesOfUser();
    }
    fixture.defaultUser = fixture.config.users.default;
  });

  /**
   * Currency switcher tests
   */
  let currSwitcherAbsolutePrice_isFirstRun = true;
  for (const currency of fixture.config.currencies.convertible) {

    describe(`Currency switcher => click to ${currency.name}, absolute delta mode`, async () => {

      beforeAll(async () => {
        if (currSwitcherAbsolutePrice_isFirstRun) {
          await testSuite.SwitchToCurrencyTest(currency.name, 'absolute');
          currSwitcherAbsolutePrice_isFirstRun = false;
        }
        await portfolioCurrencies.balanceHeader.currencySelector.switchToCurrency(currency.name);
      });

      it(`Currency switcher should change when user click to => ${currency.name}`,
        async () => await portfolioCurrencies.balanceHeader.currencySelector.assertCurrencySelected(currency.name));

      it('Portfolio balance currency icon should change to selected currency',
        async () => await portfolioCurrencies.balanceHeader.portfolioBalance.currencyIcon.assertRegularSvgIcon(currency.name));

      it('Portfolio delta currency icon should change to selected currency',
        async () => await portfolioCurrencies.balanceHeader.deltaValue.absolute.currencyIcon.assertSvgIcon(currency.name));

      it('Currency icons of balance amounts should change to selected currency',
        async () => await testSuite.SwitchToCurrenciesAmountIconTest(currency.name));

      it('Currency icons of prices should change to selected currency',
        async () => await testSuite.SwitchToCurrenciesPricesIconTest(currency.name));

      it('Currency icons of price deltas should changed to selected currency',
        async () => await testSuite.SwitchToCurrenciesPriceDeltasIconTest(currency.name));
    });
  }

  let currSwitcherRelativePrice_isFirstRun = true;
  for (const currency of fixture.config.currencies.convertible) {

    describe(`Currency switcher => click to ${currency.name}, relative delta mode`, async () => {

      beforeAll(async () => {
        if (currSwitcherRelativePrice_isFirstRun) {
          await testSuite.SwitchToCurrencyTest(currency.name, 'relative');
          currSwitcherRelativePrice_isFirstRun = false;
        }
        await portfolioCurrencies.balanceHeader.currencySelector.switchToCurrency(currency.name);
      });

      afterAll(async () => {
        // close drop-down list
        await portfolioCurrencies.balanceHeader.currencySelector.clickToCurrency(currency.name);
      });

      it(`Currency switcher should change when user click to => ${currency.name}`,
        async () => await portfolioCurrencies.balanceHeader.currencySelector.assertCurrencySelected(currency.name));

      it('Portfolio balance currency icon should change to selected currency',
        async () => await portfolioCurrencies.balanceHeader.portfolioBalance.currencyIcon.assertRegularSvgIcon(currency.name));

      it('Currency icons of balance amounts should change to selected currency',
        async () => await testSuite.SwitchToCurrenciesAmountIconTest(currency.name));

      it('Currency icons of prices should change to selected currency',
        async () => await testSuite.SwitchToCurrenciesPricesIconTest(currency.name));
    });
  }

  /**
   * Period switcher tests
   */

  for (const period of ['1H', '1D', '7D', '14D', '30D']) {
    it(`Period switcher should changing when user click to => ${period}`, async () => {
      await portfolioCurrencies.navigateTo();
      // Act
      await portfolioCurrencies.balanceHeader.deltaPeriodSelector.switchToPeriod(period);
      // Assert
      await portfolioCurrencies.balanceHeader.deltaPeriodSelector.assertPeriodSelector(period);
    });
  }

  /**
   * Delta switcher tests
   */

  /**
   * Displaying tests
   */

  describe('Portfolio empty display test', () => {
    beforeAll(async () => {
      this.fixture.defaultUser = this.fixture.config.users.empty;
      await this.fixture.relogin(this.fixture.defaultUser);
      await this.fixture.portfolio.deleteAllDepositoriesOfUser();

      const response = await this.fixture._apiClient.createExchangeDepository({
        exchange: this.defaultExchange.id,
        name: this.defaultExchange.name,
        apiKey: this.defaultExchange.public,
        apiSecret: this.defaultExchange.secret
      });

      await this.fixture.dbDepositories.updateStateOfDepository(response.id, DepositoryState.Ok);
      await portfolioCurrencies.navigateTo();
    });

    it('Title should by correct', async () => {
      await portfolioCurrencies.emptyStateView.title.assertIsPresented();
      await portfolioCurrencies.emptyStateView.title.assertText();
      await portfolioCurrencies.emptyStateView.title.assertStyle();
    });
    //
    // // Assert
    // await portfolioCurrencies.emptyStateView.title.assertIsPresented();
    // await portfolioCurrencies.emptyStateView.title.assertText();
    // await portfolioCurrencies.emptyStateView.title.assertStyle();
    //
    // await portfolioCurrencies.emptyStateView.empty.assertIsPresented();
    // await portfolioCurrencies.emptyStateView.empty.assertStyle();
    // await portfolioCurrencies.emptyStateView.empty.assertText();
    //
    // await portfolioCurrencies.emptyStateView.description.assertIsPresented();
    // await portfolioCurrencies.emptyStateView.description.assertText();
    // await portfolioCurrencies.emptyStateView.description.assertStyle();
    //
    // await portfolioCurrencies.emptyStateView.addExchangeButton.assertIsPresented();
    // await portfolioCurrencies.emptyStateView.addExchangeButton.assertText();
    // await portfolioCurrencies.emptyStateView.addExchangeButton.assertStyle();
    //
    // await portfolioCurrencies.emptyStateView.addAddressButton.assertIsPresented();
    // await portfolioCurrencies.emptyStateView.addAddressButton.assertText();
    // await portfolioCurrencies.emptyStateView.addAddressButton.assertStyle();
  });

  it('Portfolio in progress', async () => await testSuite.DisplayPortfolioEmptyButInProgress());

  it('Should be opened Currencies page when portfolio has any depository', async () => {
    // Act
    await fixture.currencies.navigateTo();
    // Assert
    await fixture.currencies.assertPageLoaded();
    await expect(await browser.driver.getCurrentUrl()).toContain('/');
    await fixture.currencies.currenciesMenuItem.assertActiveStyle();
  });

  /**
   * Navigation tests
   */

  it('Should open currency when user click to currency detail', async () => await testSuite.NavigationToCurrency());

  /**
   * Currency search tests
   */

  /**
   * Chart tests
   */

});

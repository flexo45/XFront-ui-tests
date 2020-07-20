import {AppTestFixture, DepositoryTestContext} from '../../app.test-fixture';
import {DepositoriesTests} from '../../tests/depositories.tests';
import {describe} from 'selenium-webdriver/testing';
import {DepositoryListRowPageObjectComponent} from '../../app/componets/depository-list.po';

describe('XFront App - Depositories list test suite', () => {

  const fixture: AppTestFixture = new AppTestFixture();
  fixture.defaultUser = fixture.config.users.default;

  const testSuite: DepositoriesTests = new DepositoriesTests(fixture);

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

  let depoSwitcherAbsolute_isFirstRun = true;
  for (const currency of fixture.config.currencies.convertible) {
    const portfolioDepositories = fixture.depositories;

    describe(`Currency switcher => click to ${currency.name}, absolute delta mode`, async () => {

      beforeAll(async () => {
        if (depoSwitcherAbsolute_isFirstRun) {
          await testSuite.SwitchToCurrencyTest(currency.name, 'absolute');
          depoSwitcherAbsolute_isFirstRun = false;
        }
        await portfolioDepositories.balanceHeader.currencySelector.switchToCurrency(currency.name);
      });

      afterAll(async () => {
        // close drop-down list
        await portfolioDepositories.balanceHeader.currencySelector.clickToCurrency(currency.name);
      });

      it(`Currency switcher should change when user click to => ${currency.name}`,
        async () => await portfolioDepositories.balanceHeader.currencySelector.assertCurrencySelected(currency.name));

      it('Portfolio balance currency icon should change to selected currency',
        async () => await portfolioDepositories.balanceHeader.portfolioBalance.currencyIcon.assertRegularSvgIcon(currency.name));

      it('Portfolio delta currency icon should change to selected currency',
        async () => await portfolioDepositories.balanceHeader.deltaValue.absolute.currencyIcon.assertSvgIcon(currency.name));

      it('Currency icons of balance should change to selected currency',
        async () => await testSuite.SwitchToCurrenciesBalanceIconTest(currency.name));

      it('Currency icons of balance deltas should changed to selected currency',
        async () => await testSuite.SwitchToCurrenciesBalanceDeltaIconTest(currency.name));
    });
  }

  let depoSwitcherRelative_isFirstRun = true;
  for (const currency of fixture.config.currencies.convertible) {
    const portfolioDepositories = fixture.depositories;

    describe(`Currency switcher => click to ${currency.name}, relative delta mode`, () => {

      beforeAll(async () => {
        if (depoSwitcherRelative_isFirstRun) {
          await testSuite.SwitchToCurrencyTest(currency.name, 'relative');
          depoSwitcherRelative_isFirstRun = false;
        }
        await portfolioDepositories.balanceHeader.currencySelector.switchToCurrency(currency.name);
      });

      afterAll(async () => {
        // close drop-down list
        await portfolioDepositories.balanceHeader.currencySelector.clickToCurrency(currency.name);
      });

      it(`Currency switcher should change when user click to => ${currency.name}`,
        async () => await portfolioDepositories.balanceHeader.currencySelector.assertCurrencySelected(currency.name));

      it('Portfolio balance currency icon should change to selected currency',
        async () => await portfolioDepositories.balanceHeader.portfolioBalance.currencyIcon.assertRegularSvgIcon(currency.name));

      it('Portfolio delta currency icon should change to selected currency',
        async () => await portfolioDepositories.balanceHeader.deltaValue.absolute.currencyIcon.assertSvgIcon(currency.name));

      it('Currency icons of balance should change to selected currency',
        async () => await testSuite.SwitchToCurrenciesBalanceIconTest(currency.name));

      it('Currency icons of balance deltas should changed to selected currency',
        async () => await testSuite.SwitchToCurrenciesBalanceDeltaIconTest(currency.name));
    });
  }

  /**
   * Period switcher tests
   */
  for (const period of ['1H', '1D', '7D', '14D', '30D']) {
    it(`Period switcher should changing when user click to => ${period}`, async () => {
      const portfolioCurrencies = fixture.depositories;
      await portfolioCurrencies.navigateTo();
      // Act
      await portfolioCurrencies.balanceHeader.deltaPeriodSelector.switchToPeriod(period);
      // Assert
      await portfolioCurrencies.balanceHeader.deltaPeriodSelector.assertPeriodSelector(period);
    });
  }

  /**
   * Navigation tests
   */
  describe('Navigate to depository detail and back', () => {

    it('Should open depository detail when user click to depository row',
      async () => await testSuite.NavigationToDepositoryFromList());

    it('Should return back to depository list from depository detail',
      async () => await testSuite.NavigationBackToList());
  });


  /**
   * Displaying tests
   */

  // max 5
  describe('Depository limits tests', () => {

    beforeAll(async () => {
      await fixture.portfolio.deleteAllDepositoriesOfUser();
    });

    afterEach(async () => {
      await fixture.portfolio.deleteAllDepositoriesOfUser();
    });

    for (const count of [1, 4]) {
      it(`Should show 'Add exchange' button when user exchange limit not exceeded ${count}`,
        async () => {
          await testSuite.DepositoryExchangeLimitTest(count);
          await fixture.depositories.addExchangeButton.assertIsPresented();
        });
    }

    for (const count of [5]) {
      it(`Should hide 'Add exchange' button when user exchange limit exceeded ${count}`,
        async () => {
          await testSuite.DepositoryExchangeLimitTest(count);
          await fixture.depositories.addExchangeButton.assertNotPresented();
        });
    }

    for (const count of [1, 4]) {
      it(`Should show 'Add address' button when user exchange limit not exceeded ${count}`,
        async () => {
          await testSuite.DepositoryBlockchainLimitTest(count);
          await fixture.depositories.addAddressButton.assertIsPresented();
        });
    }

    for (const count of [5]) {
      it(`Should hide 'Add address' button when user exchange limit exceeded ${count}`,
        async () => {
          await testSuite.DepositoryBlockchainLimitTest(count);
          await fixture.depositories.addAddressButton.assertNotPresented();
        });
    }

    for (const count of [1, 4]) {
      it(`Should show 'Add exchange' and 'Add address' buttons when user exchange limit exceeded ${count}`,
        async () => {
          await testSuite.DepositoryExchangeLimitTest(count);
          await testSuite.DepositoryBlockchainLimitTest(count);
          await fixture.depositories.addExchangeButton.assertIsPresented();
          await fixture.depositories.addAddressButton.assertIsPresented();
        });
    }

    for (const count of [5]) {
      it(`Should show 'Add exchange' and 'Add address' buttons when user exchange limit exceeded ${count}`,
        async () => {
          await testSuite.DepositoryExchangeLimitTest(count);
          await testSuite.DepositoryBlockchainLimitTest(count);
          await fixture.depositories.addExchangeButton.assertNotPresented();
          await fixture.depositories.addAddressButton.assertNotPresented();
        });
    }

  });

  describe('Display syncing empty portfolio test', () => {

    let syncingDepository: DepositoryTestContext;
    let depositoryPage: DepositoryListRowPageObjectComponent;
    const portfolioDepository = fixture.depositories;

    beforeAll(async () => { syncingDepository = await testSuite.DisplayPortfolioEmptyButInProgress(); });

    afterAll(async () => {
      await fixture.portfolio.deleteAllDepositoriesOfUser();
      await fixture.portfolio.addSomeDepositoriesWithCoinsToUser([fixture.config.exchanges.binance, fixture.config.exchanges.bitmex], []);
    });

    it('Should open depository list with no errors', async () => {
      await portfolioDepository.navigateTo();
      await portfolioDepository.syncingStateView.assertPageLoaded();
    });

    it(`Should display 'Your portfolio is' text`, async () => {
      await portfolioDepository.syncingStateView.title.assertIsPresented();
      await portfolioDepository.syncingStateView.title.assertText();
      await portfolioDepository.syncingStateView.title.assertStyle();
    });

    it(`Should display 'Syncing...' header`, async () => {
      await portfolioDepository.syncingStateView.syncing.assertIsPresented();
      await portfolioDepository.syncingStateView.syncing.assertStyle();
      await expect(await portfolioDepository.syncingStateView.syncing.el.getText()).toContain('Syncing');
    });

    it(`Should display depository list with one syncing depository`, async () => {
      await portfolioDepository.depositoryList.assertIsPresented();
      depositoryPage = portfolioDepository.depositoryList.getRowByGuid(syncingDepository.id);
    });

    it(`Should display correct information in depository row`, async () => {
      await depositoryPage.depositoryColumn.depositoryName.assertIsPresented();
      await depositoryPage.depositoryColumn.exchangeImage.assertIsPresented();
      await depositoryPage.depositoryColumn.depositoryState.assertIsPresented();
      await depositoryPage.depositoryColumn.depositoryState.syncInProgressText.assertText();

      await expect(await depositoryPage.balanceColumn.balanceAmount.number.value.getText()).toBe('0', 'balance should be 0');
      await depositoryPage.balanceColumn.balanceDeltaValue.assertNotPresented();

      await depositoryPage.shareColumn.shareBar.assertIsPresented();
    });
  });

  describe('Display empty portfolio test', () => {

    let emptyDepository: DepositoryTestContext;
    let depositoryPage: DepositoryListRowPageObjectComponent;
    const portfolioDepository = fixture.depositories;

    beforeAll(async () => { emptyDepository = await testSuite.DisplayPortfolioEmpty(); });

    afterAll(async () => {
      await fixture.portfolio.deleteAllDepositoriesOfUser();
      await fixture.portfolio.addSomeDepositoriesWithCoinsToUser([fixture.config.exchanges.binance, fixture.config.exchanges.bitmex], []);
    });

    it('Should open depository list with no errors', async () => {
      await portfolioDepository.navigateTo();
      await portfolioDepository.emptyStateView.assertPageLoaded();
    });

    it(`Should display 'Your portfolio is' text`, async () => {
      await portfolioDepository.emptyStateView.title.assertIsPresented();
      await portfolioDepository.emptyStateView.title.assertText();
      await portfolioDepository.emptyStateView.title.assertStyle();
    });

    it(`Should display 'Empty' header`, async () => {
      await portfolioDepository.emptyStateView.empty.assertIsPresented();
      await portfolioDepository.emptyStateView.empty.assertText();
      await portfolioDepository.emptyStateView.empty.assertStyle();
    });

    it(`Should display depository list with one syncing depository`, async () => {
      await portfolioDepository.depositoryList.assertIsPresented();
      depositoryPage = portfolioDepository.depositoryList.getRowByGuid(emptyDepository.id);
    });

    it(`Should display correct information in depository row`, async () => {
      await depositoryPage.depositoryColumn.depositoryName.assertIsPresented();
      await depositoryPage.depositoryColumn.exchangeImage.assertIsPresented();
      await depositoryPage.depositoryColumn.depositoryState.assertIsPresented();
      await depositoryPage.depositoryColumn.depositoryState.todaySyncText.assertPattern();

      await expect(await depositoryPage.balanceColumn.balanceAmount.number.value.getText()).toBe('0', 'balance should be 0');
      await depositoryPage.balanceColumn.balanceDeltaValue.assertNotPresented();

      await depositoryPage.shareColumn.shareBar.assertIsPresented();
    });
  });

});

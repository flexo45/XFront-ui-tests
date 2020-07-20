import {AppTestFixture, CurrencyTestContext} from '../../app.test-fixture';
import {CurrencyPageObjectApp} from '../../app/app.currency.po';
import {CurrencyDetailDepositoryListRowPageObjectComponent} from '../../app/componets/currency-detail-depository-list.po';
import {DeltaValue} from '../../../../src/app/portfolio/delta-value/delta-value';

describe('XFront App - Currency details test suite', () => {

  const fixture: AppTestFixture = new AppTestFixture();
  fixture.defaultUser = fixture.config.users.default;

  let currencyDetail: CurrencyPageObjectApp, currencyOfUser: {currency: CurrencyTestContext, amount: number};

  beforeAll(async () => {
    await fixture.relogin(fixture.defaultUser);
    await fixture.portfolio.deleteAllDepositoriesOfUser();
    await fixture.portfolio.addSomeDepositoriesWithCoinsToUser([fixture.config.exchanges.binance], []);

    currencyOfUser = fixture.testContext.user.currencies[0];
    currencyDetail = new CurrencyPageObjectApp(currencyOfUser.currency.name, currencyOfUser.currency.id);
  });

  afterEach(async () => {
    if (fixture.defaultUser.login === fixture.config.users.empty.login) {
      await fixture.portfolio.deleteAllDepositoriesOfUser();
    }
    fixture.defaultUser = fixture.config.users.default;
  });

  /**
   * Navigation tests
   */
  it('Should display depository list when user click to back arrow, after direct navigation to page',
    async () => {});

  it('Back Arrow');

  it('To Currency');

  /**
   * Currency switcher - tests
   */
  let currSwitcherAbsolute_isFirstRun = true;
  for (const currency of fixture.config.currencies.convertible) {

    describe(`Currency switcher refreshing test => click to ${currency.name}, absolute delta mode`, async () => {

      beforeAll(async () => {

        if (currSwitcherAbsolute_isFirstRun) {
          await currencyDetail.navigateTo();
          await currencyDetail.balanceHeader.deltaPeriodSelector.switchToPeriod('1D');
          await currencyDetail.switchDeltaMode('absolute');
          currSwitcherAbsolute_isFirstRun = false;
        }
        await currencyDetail.balanceHeader.currencySelector.switchToCurrency(currency.name);
      });

      afterAll(async () => {
        // close drop-down list
        await currencyDetail.balanceHeader.currencySelector.clickToCurrency(currency.name);
      });

      it(`Currency switcher should change when user click to => ${currency.name}`,
        async () => await currencyDetail.balanceHeader.currencySelector.assertCurrencySelected(currency.name));

      it('Portfolio balance currency icon should change to selected currency',
        async () => await currencyDetail.balanceHeader.portfolioBalance.currencyIcon.assertRegularSvgIcon(currency.name));

      it('Portfolio delta currency icon should change to selected currency',
        async () => await currencyDetail.balanceHeader.deltaValue.absolute.currencyIcon.assertSvgIcon(currency.name));

      it('Price ticker should change to selected currency',
        async () => await currencyDetail.price.number.ticker.assertText(` ${currency.name}`));

      it('Currency icons of balance amounts should change to selected currency', async () => {
        for (let i = 0; i < await currencyDetail.depositoryList.getRowCount(); i++) {
          await currencyDetail.depositoryList.getRow(i + 1)
            .balanceColumn.balanceAmount.currencyIcon.assertRegularSvgIcon(currency.name);
        }
      });
    });
  }

  let currSwitcherRelative_isFirstRun = true;
  for (const currency of fixture.config.currencies.convertible) {

    describe(`Currency switcher => click to ${currency.name}, relative delta mode`, async () => {

      beforeAll(async () => {
        if (currSwitcherRelative_isFirstRun) {
          await currencyDetail.navigateTo();
          await currencyDetail.balanceHeader.deltaPeriodSelector.switchToPeriod('1D');
          await currencyDetail.switchDeltaMode('relative');
          currSwitcherRelative_isFirstRun = false;
        }
        await currencyDetail.balanceHeader.currencySelector.switchToCurrency(currency.name);
      });

      afterAll(async () => {
        // close drop-down list
        await currencyDetail.balanceHeader.currencySelector.clickToCurrency(currency.name);
      });

      it(`Currency switcher should change when user click to => ${currency.name}`,
        async () => await currencyDetail.balanceHeader.currencySelector.assertCurrencySelected(currency.name));

      it('Portfolio balance currency icon should change to selected currency',
        async () => await currencyDetail.balanceHeader.portfolioBalance.currencyIcon.assertRegularSvgIcon(currency.name));

      it('Price ticker should change to selected currency',
        async () => await currencyDetail.price.number.ticker.assertText(` ${currency.name}`));

      it('Currency icons of balance amounts should change to selected currency', async () => {
        for (let i = 0; i < await currencyDetail.depositoryList.getRowCount(); i++) {
          await currencyDetail.depositoryList.getRow(i + 1)
            .balanceColumn.balanceAmount.currencyIcon.assertRegularSvgIcon(currency.name);
        }
      });
    });
  }

  /**
   * Period switcher tests
   */
  for (const period of ['1H', '1D', '7D', '14D', '30D']) {
    it(`Period switcher should changing when user click to => ${period}`, async () => {
      await currencyDetail.navigateTo();
      // Act
      await currencyDetail.balanceHeader.deltaPeriodSelector.switchToPeriod(period);
      // Assert
      await currencyDetail.balanceHeader.deltaPeriodSelector.assertPeriodSelector(period);
    });
  }

  /**
   * Displaying tests
   */
  const displaying_testData = {
    coinTicker: 'BCH', // Bitcoin cash
  };

  const displaying_testSuite = [
    {desc: 'one exchange depository', data: [
      {exchange: fixture.config.exchanges.binance, amount: 300, share: '100', db_id: ''}
      ]
    },
    {desc: 'several exchange depository', data: [
        {exchange: fixture.config.exchanges.binance, amount: 200, share: '40.00', db_id: ''},
        {exchange: fixture.config.exchanges.bitmex, amount: 300, share: '60.00', db_id: ''}
      ]
    },
    {desc: 'exchange and wallet', data: [
        {exchange: fixture.config.exchanges.hitbtc, amount: 346, share: '41.64', db_id: ''},
        {wallet: fixture.config.wallets.ethereum, amount: 485, share: '58.36', db_id: ''}
      ]
    },
    {desc: 'one wallet depository', data: [
        {wallet: fixture.config.wallets.ethereum, amount: 464, share: '100', db_id: ''}
      ]
    }
  ];

  for (const testCase of displaying_testSuite) {
    describe(`Data displaying test - ${testCase.desc} has coin ${displaying_testData.coinTicker}`, () => {

      let expectedCurrency: CurrencyTestContext, expectedTotalAmount: number;

      const testData = testCase.data;

      beforeAll(async () => {
        await fixture.relogin(fixture.defaultUser);
        await fixture.portfolio.deleteAllDepositoriesOfUser();
        expectedCurrency = await fixture.portfolio.currenciesService.getCurrencyByTicker(displaying_testData.coinTicker);
        expectedTotalAmount = testData.reduce((accum, x) => accum + x.amount, 0);
        for (let i = 0; i < testData.length; i++) {
          let depositoryTestContext;
          if (testData[i].exchange) {
            depositoryTestContext = await fixture.portfolio.addExchangeToUser({
              id: testData[i].exchange.id,
              name: `Test Depository ${i}`,
              public: `Public_123${i}`,
              secret: `Secret_123${i}`
            });
          }
          if (testData[i].wallet) {
            depositoryTestContext = await fixture.portfolio.addWalletToUser({
              address: fixture.config.addresses.ethereum[i],
              id: testData[i].wallet.id,
              name: `Test Depository ${i}`
            });
          }
          testData[i].db_id = depositoryTestContext.id;
          await fixture.portfolio.addCurrenciesToDepository(depositoryTestContext, [{ currency: expectedCurrency, amount:  testData[i].amount}]);
        }
        currencyDetail = new CurrencyPageObjectApp(expectedCurrency.name, expectedCurrency.id);
        await currencyDetail.navigateTo();
        await currencyDetail.balanceHeader.deltaPeriodSelector.switchToPeriod('1D');
      });

      afterAll(async () => {
        await fixture.relogin(fixture.defaultUser);
        await fixture.portfolio.deleteAllDepositoriesOfUser();
        await fixture.portfolio.addSomeDepositoriesWithCoinsToUser([fixture.config.exchanges.binance], []);

        currencyOfUser = fixture.testContext.user.currencies[0];
        currencyDetail = new CurrencyPageObjectApp(currencyOfUser.currency.name, currencyOfUser.currency.id);
      });

      it(`Page header should by correct - name of Coin`, async () => {
        await currencyDetail.balanceHeader.text.assertText(expectedCurrency.name);
      });

      it('Total amount value should be correct', async () => {
        await currencyDetail.total.number.displayRegular.assertText(`${expectedTotalAmount} ${expectedCurrency.ticker}`);
      });

      for (const currency of fixture.config.currencies.convertible) {

        it(`Total balance should be correct when selected ${currency.name}`, async () => {
          const expectedTotalBalance = expectedTotalAmount * await fixture.portfolio.convertPrice(expectedCurrency.ticker, currency.name);
          const expectedTotalBalancePrice = await fixture.portfolio.convertToUsdPrice(currency.name);

          await currencyDetail.balanceHeader.portfolioBalance.assertBalanceText(expectedTotalBalance, expectedTotalBalancePrice);
        });

        it(`Price delta should by correct, smoke test (last test data state, 1D period)`, async () => {
          const excpectedDelta = new DeltaValue(this.currency.balance, this.historyBalance);
        });

        it(`Price value should be correct when selected ${currency.name}`, async () => {
          await currencyDetail.balanceHeader.currencySelector.switchToCurrency(currency.name);
          await currencyDetail.price.number.assertPriceText(await fixture.portfolio.convertPrice(expectedCurrency.ticker, currency.name), currency.name);
        });
      }

      it (`Depository list should contain ${testCase.data.length} items`, async () => {
        await currencyDetail.depositoryList.assertRowCount(testData.length);
      });

      for (let i = 0; i < testData.length; i++) {
        describe(`Depository list display test, depository at ${testData[i].exchange ? testData[i].exchange.name : testData[i].wallet.name}`, () => {

          let depositoryRow: CurrencyDetailDepositoryListRowPageObjectComponent;

          beforeAll(() => {
            depositoryRow = currencyDetail.depositoryList.getRowByGuid(testData[i].db_id);
          });
          for (const currency of fixture.config.currencies.convertible) {
            it(`Balance number should be correct when convertible => ${currency.name}`, async () => {
              const expectedBalance = testData[i].amount * await fixture.portfolio.convertPrice(expectedCurrency.ticker, currency.name);
              const expectedBalancePrice = await fixture.portfolio.convertToUsdPrice(currency.name);

              await currencyDetail.balanceHeader.currencySelector.switchToCurrency(currency.name);
              await depositoryRow.balanceColumn.balanceAmount.assertBalanceText(expectedBalance, expectedBalancePrice);

              await depositoryRow.balanceColumn.balanceAmount.currencyIcon.assertRegularSvgIcon(currency.name);
            });
          }

          it(`Amount should be correct`, async () => {
            await depositoryRow.amountColumn.currencyAmount.assertAmountText(testData[i].amount, expectedCurrency.ticker);
          });

          it(`Share should be ${testData[i].share}%`, async () => {
            await depositoryRow.shareColumn.shareBar.assertShare(testData[i].share);
          });
        });
      }
    });
  }
});

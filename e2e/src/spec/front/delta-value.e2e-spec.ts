import {AppTestFixture} from '../../app.test-fixture';
import {DepositoryState} from '../../data-access/db.depositories';

describe('XFront App - Delta Value test suite', function() {

  const fixture: AppTestFixture = new AppTestFixture();

  const deltaValueMode = ['relative', 'absolute'];

  beforeAll(async () => {
    fixture.defaultUser = fixture.config.users.empty;
    // await fixture.beforeAllDefault();
    await fixture.__prepareTestDataInDb();
  });

  afterEach(async () => {
    await fixture.portfolio.deleteAllDepositoriesOfUser();
  });

  for (const mode of deltaValueMode) {
    it (`Should not display ${mode} delta value when currency have not price history`, async () => {
      // Arrange
      const response = await fixture._apiClient.createExchangeDepository({
        name: 'e2e delta-value test',
        apiSecret: 'ghty56',
        apiKey: 'dsag34t3',
        exchange: 1
      });
      await fixture.dbDepositories.updateStateOfDepository(response.id, DepositoryState.Ok);
      await fixture.dbDepositories.addCurrenciesBalancesToDepository(response.id, [
        [fixture.config.currencies.testing.currencyIdTooLowDelta, 100],
        [fixture.config.currencies.testing.currencyIdNoHistory, 300],
        [fixture.config.currencies.testing.currenciesIdNormal[0], 1000]]);

      // Act
      await fixture.currencies.navigateTo();
      await fixture.currencies.balanceHeader.deltaPeriodSelector.switchToPeriod('1H');
      await fixture.currencies.switchDeltaMode(mode);

      for (const currency of fixture.config.currencies.convertible) {
        await fixture.currencies.balanceHeader.currencySelector.switchToCurrency(currency.name);

        // Assert
        const rowUnderTesting = await fixture.currencies.currenciesList.getRowByGuid(fixture.config.currencies.testing.currencyIdNoHistory);
        await rowUnderTesting.assertRowIsDisplayed();
        await rowUnderTesting.priceColumn.priceDeltaValue.assertNotPresented();
      }
    });

    it (`Should not display ${mode} delta value less then 1e-18`, async () => {
      // Arrange
      const response = await fixture._apiClient.createExchangeDepository({
        name: 'e2e delta-value test',
        apiSecret: 'ghty56',
        apiKey: 'dsag34t3',
        exchange: 1
      });
      await fixture.dbDepositories.updateStateOfDepository(response.id, DepositoryState.Ok);
      await fixture.dbDepositories.addCurrenciesBalancesToDepository(response.id, [
        [fixture.config.currencies.testing.currencyIdTooLowDelta, 100],
        [fixture.config.currencies.testing.currenciesIdNormal[0], 1000]]);

      // Act
      await fixture.currencies.navigateTo();
      await fixture.currencies.balanceHeader.deltaPeriodSelector.switchToPeriod('1H');
      await fixture.currencies.switchDeltaMode(mode);

      for (const currency of fixture.config.currencies.convertible) {
        await fixture.currencies.balanceHeader.currencySelector.switchToCurrency(currency.name);

        // Assert
        const rowUnderTesting = await fixture.currencies.currenciesList.getRowByGuid(fixture.config.currencies.testing.currencyIdTooLowDelta);
        await rowUnderTesting.assertRowIsDisplayed();
        await rowUnderTesting.priceColumn.priceDeltaValue.assertNotPresented();
      }
    });
  }
});

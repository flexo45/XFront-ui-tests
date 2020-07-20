import {AppTestFixture} from '../../app.test-fixture';
import {DepositoryDetailsTests} from '../../tests/depository-details.tests';
import {Exchanges} from '../../app/app.attach-exchange.po';
import {DepositoryAppPage} from '../../app/app.depository.po';
import {browser} from 'protractor';
import {DepositoryState} from '../../data-access/db.depositories';
import {takeScreenshotWhenFail} from '../../utils';

describe('XFront App - Depository details test suite', function() {

  const fixture: AppTestFixture = new AppTestFixture();
  fixture.defaultUser = fixture.config.users.default;

  const testSuit: DepositoryDetailsTests = new DepositoryDetailsTests(fixture);

  beforeAll(async () => {
    await fixture.relogin(fixture.defaultUser);
    await fixture.portfolio.deleteAllDepositoriesOfUser();
    await fixture.portfolio.addSomeDepositoriesWithCoinsToUser([fixture.config.exchanges.binance], []);
  });

  afterEach(async () => {
    await takeScreenshotWhenFail();
    if (fixture.defaultUser.login === fixture.config.users.empty.login) {
      await fixture.portfolio.deleteAllDepositoriesOfUser();
    }
    fixture.defaultUser = fixture.config.users.default;
  });

  /**
   * Syncyng
   */

  it('Force sync');

  describe('Edit depository test suite', () => {

    beforeEach(async () => {
      await fixture.portfolio.deleteAllDepositoriesOfUser();
      await fixture.portfolio.addSomeDepositoriesWithCoinsToUser([fixture.config.exchanges.binance], []);
    });

    it('Should update exchange depository when user do no changes',
      async () => await testSuit.EditExchangeNoChangesTest(fixture.testContext.user.getExchange(fixture.config.exchanges.binance.id)));

    it('Should update name of exchange depository when user edit it',
      async () => await testSuit.EditNameChangesTest(fixture.testContext.user.getExchange(fixture.config.exchanges.binance.id), 'Edited depository'));

    it('Edit api key');

    it('Validation');

    it('Should not update exchange depository when user discard changes ',
      async () => await testSuit.EditDiscardChangesTest(fixture.testContext.user.getExchange(fixture.config.exchanges.binance.id)));
  });

  /**
   * Delete depository tests
   */
  describe(`Delete depository test suite`, () => {

    beforeAll(async () => {
      await fixture.portfolio.deleteAllDepositoriesOfUser();
      await fixture.portfolio.deleteAllDepositoriesOfExchange(fixture.config.exchanges.hitbtc);
      await fixture.portfolio.addSomeDepositoriesWithCoinsToUser([fixture.config.exchanges.hitbtc], []);
    });

    afterAll(async () => {
      await fixture.relogin(fixture.defaultUser);
      await fixture.portfolio.deleteAllDepositoriesOfUser();
      await fixture.portfolio.addSomeDepositoriesWithCoinsToUser([fixture.config.exchanges.binance], []);
    });

    it('Should not remove depository when user discard delete',
      async () => await testSuit.DeleteDiscardTest(fixture.testContext.user.getExchange(Exchanges.HitBtc)));

    describe('Delete last one depository in user portfolio', () => {

      beforeAll(async () => {
        await fixture.portfolio.deleteAllDepositoriesOfUser();
        await fixture.portfolio.deleteAllDepositoriesOfExchange(fixture.config.exchanges.hitbtc);
        await fixture.portfolio.addSomeDepositoriesWithCoinsToUser([fixture.config.exchanges.hitbtc], []);
      });

      afterAll(async () => {
        await fixture.portfolio.deleteAllDepositoriesOfExchange(fixture.config.exchanges.hitbtc);
      });

      it('Should delete exchange user depository when user confirm delete',
        async () => await testSuit.DeleteExchangeUserDepositoryTest(fixture.testContext.user.getExchange(Exchanges.HitBtc)));

      it('Should delete exchange depository when it is last one depository',
        async () => await testSuit.DeleteDepositoryRemovedAssert(fixture.config.exchanges.hitbtc.public));

      it('Should display welcome page when it is last one depository in user portfolio',
        async () => await fixture.welcome.assertPageLoaded());

    });

    describe('Delete one of many user depository', () => {

      beforeAll(async () => {
        await fixture.relogin(fixture.config.users.support);
        await fixture.portfolio.deleteAllDepositoriesOfUser();
        await fixture.portfolio.addSomeDepositoriesWithCoinsToUser([fixture.config.exchanges.hitbtc], []);
        await fixture.relogin(fixture.defaultUser);
        await fixture.portfolio.addSomeDepositoriesWithCoinsToUser([fixture.config.exchanges.bitmex, fixture.config.exchanges.hitbtc], []);
      });

      afterAll(async () => {
        await fixture.portfolio.deleteAllDepositoriesOfExchange(fixture.config.exchanges.hitbtc);
      });

      it('Should delete exchange user depository when user confirm delete',
        async () => await testSuit.DeleteExchangeUserDepositoryTest(fixture.testContext.user.getExchange(Exchanges.HitBtc)));

      it('Should not delete exchange depository when it have an another user',
        async () => await testSuit.DeleteDepositoryExistAssert(fixture.config.exchanges.hitbtc.public));

      it('Should display depository list when delete depository, but portfolio have any depository',
        async () => await fixture.depositories.assertPageLoaded()); // Add assert for list not contain the depository
    });

  });

  /**
   * Navigation tests
   */
  it('Should display depository list when user click to back arrow, after direct navigation to page',
    async () => {});

  it('Back Arrow');

  it('To Currency');

  /**
   * Displaying tests
   */
  describe('Depository empty tests', () => {

    let depositoryPage: DepositoryAppPage;

    beforeAll(async () => {
      await fixture.relogin(fixture.defaultUser);
      await fixture.portfolio.deleteAllDepositoriesOfUser();
      const exchange = await fixture.portfolio.addExchangeToUser(fixture.defaultExchange);
      await fixture.portfolio.changeDepositoryState(exchange.id, DepositoryState.Ok);
      depositoryPage = new DepositoryAppPage(exchange.name, exchange.id);
    });

    it('Should open depository details with no error', async () => {
      await depositoryPage.navigateTo();
      await depositoryPage.assertPageLoaded();
    });

    it(`Should display '%depository name% is' text`, async () => {
      await depositoryPage.emptyStateView.title.assertText();
      await depositoryPage.emptyStateView.title.assertStyle();
    });

    it(`Should display 'Empty' header`, async () => {
      await depositoryPage.emptyStateView.header.assertText();
      await depositoryPage.emptyStateView.header.assertStyle();
    });

    it(`Should display description text`, async () => {
      await depositoryPage.emptyStateView.description.assertText();
      await depositoryPage.emptyStateView.description.assertStyle();
    });

    it(`Should display depository add buttons`, async () => {
      await depositoryPage.emptyStateView.addExchangeButton.assertIsPresented();
      await depositoryPage.emptyStateView.addAddressButton.assertIsPresented();
    });

    it(`Should display tools buttons`, async () => {
      await depositoryPage.forceSync.assertIsPresented();
      await depositoryPage.editButton.assertIsPresented();
      await depositoryPage.deleteButton.assertIsPresented();
    });

    it(`Should display status`, async () => {
      await depositoryPage.depositoryStatus.assertIsPresented();
    });

    /**
     * Navigation
     */
    it(`Should open attach exchange when user click 'Add exchange'`, async () => {
      await depositoryPage.navigateTo();
      await depositoryPage.emptyStateView.addExchangeButton.click();
      await fixture.attachExchange.assertPageLoaded();
    });

    it('Should open empty depository detail when user click back in attach exchange', async () => {
      await fixture.attachExchange.backArrow.click();
      await depositoryPage.assertPageLoaded();
    });

    it(`Should open attach exchange when user click 'Add address'`, async () => {
      await depositoryPage.navigateTo();
      await depositoryPage.emptyStateView.addAddressButton.click();
      await fixture.attachWallet.assertPageLoaded();
    });

    it('Should open empty depository detail when user click back in attach wallet', async () => {
      await fixture.attachWallet.backArrow.click();
      await depositoryPage.assertPageLoaded();
    });


    /**
     * Edit empty
     */

    /**
     * Delete empty
     */
    it(`Should delete empty depository`, async () => {
      await depositoryPage.navigateTo();
      await depositoryPage.deleteButton.click();
      await browser.sleep(1000);
      await depositoryPage.deleteSideNav.deleteButton.click();
      // Assert
      await fixture.welcome.assertPageLoaded();
    });

  });



  describe('Depository syncing in progress', () => {
    let depositoryPage: DepositoryAppPage;

    beforeAll(async () => {
      await fixture.relogin(fixture.defaultUser);
      await fixture.portfolio.deleteAllDepositoriesOfUser();
      const exchange = await fixture.portfolio.addExchangeToUser(fixture.defaultExchange);
      depositoryPage = new DepositoryAppPage(exchange.name, exchange.id);
    });

    it('Should open depository details with no error', async () => {
      await depositoryPage.navigateTo();
      await depositoryPage.assertPageLoaded();
    });

    it(`Should display '%depository name% is' text`, async () => {
      await depositoryPage.syncingStateView.title.assertText();
      await depositoryPage.syncingStateView.title.assertStyle();
    });

    it(`Should display 'Syncing...' header`, async () => {
      await depositoryPage.syncingStateView.header.assertContainText();
      await depositoryPage.syncingStateView.header.assertStyle();
    });

    it(`Should display description text`, async () => {
      await depositoryPage.syncingStateView.description.assertText();
      await depositoryPage.syncingStateView.description.assertStyle();
    });

    it(`Should display tools buttons but force-sync`, async () => {
      await depositoryPage.forceSync.assertNotPresented();
      await depositoryPage.editButton.assertIsPresented();
      await depositoryPage.deleteButton.assertIsPresented();
    });

    it(`Should not display status`, async () => {
      await depositoryPage.depositoryStatus.assertNotPresented();
    });

    /**
     * Edit syncing
     */

    /**
     * Delete syncing
     */
    it(`Should delete empty depository`, async () => {
      await depositoryPage.navigateTo();
      await depositoryPage.deleteButton.click();
      await browser.sleep(1000);
      await depositoryPage.deleteSideNav.deleteButton.click();
      // Assert
      await fixture.welcome.assertPageLoaded();
    });
  });

  it('Depository syncing warning');

  it('Depository syncing error');

  it('Depository syncing complete');

});

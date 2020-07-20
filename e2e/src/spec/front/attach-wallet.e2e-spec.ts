import {AppTestFixture} from '../../app.test-fixture';
import {AttachWalletTests} from '../../tests/attach.wallet';
import {Blockchain} from '../../app/app.attach-wallet.po';
import {takeScreenshotWhenFail} from '../../utils';

describe('XFront App - Attach Wallet test suite', function() {

  const fixture: AppTestFixture = new AppTestFixture();
  fixture.defaultUser = fixture.config.users.empty;

  const testSuit: AttachWalletTests = new AttachWalletTests(fixture);

  beforeAll(async () => {
    await fixture.relogin(fixture.defaultUser);
    await fixture.portfolio.deleteAllDepositoriesOfUser();
  });

  afterEach(async () => {
    await takeScreenshotWhenFail();
    await fixture.portfolio.deleteAllDepositoriesOfUser();
  });

  /**
   * Attach depository positive tests
   */

  for (const wallet of fixture.config.wallets.array()) {
    it('Should success validate address of wallet => ' + wallet.name, async () => testSuit.AttachValidateAddress(wallet));

    it('Should success attache new address of wallet => ' + wallet.name, async () => testSuit.AttachWalletToPortfolio(wallet));
  }

  it('User should attach depository of blockchain, when it name already exist at depository another user own',
    async () => await testSuit.AttachDepositoryWithAlreadyExistNameAtOtherUserPortfolio());

  it('User should attach depository, when it name already exist at depository another user own, but addresses are different',
    async () => await testSuit.AttachDepositoryWithAlreadyExistNameButDiffAddressAtOtherUserPortfolio());

  /**
   * Attach depository negative tests
   */

  it('App should display error message, when user try attach depository with name already exist at other depository user own',
    async () => await testSuit.ValidationDepoWithSameNameAlreadyExistAtUserOwn());

  it('Should display alerts message if address empty',
    async () => testSuit.ValidationAddressEmpty());

  for (const wallet of [
    { id: Blockchain.Bitcoin, address: '34gfjh6fg5j6h8ghgf8hfg67h', name: fixture.config.wallets.bitcoin.name },
    { id: Blockchain.Bitcoin, address: fixture.config.wallets.ethereum.address, name: fixture.config.wallets.bitcoin.name },
    { id: Blockchain.Ethereum, address: fixture.config.wallets.ethereum_noOx.address, name: fixture.config.wallets.ethereum.name }
  ]) {
    it('Should display alerts message if address invalid => name=' + wallet.name + ', address=' + wallet.address,
      async () => testSuit.ValidationAddressInvalid(wallet));
  }

  it('Should display alert message if depository name is empty',
    async () => testSuit.ValidationDepositoryNameEmpty());

  for (const wallet of fixture.config.wallets.array()) {
    it('Should display alert message if wallet with same address already attached, => ' + wallet.name,
      async () => testSuit.ValidationAddressAlreadyAttachedToPortfolio());
  }

  /**
   * Navigation tests
   */

  it('Should open welcome page when user press "Back Arrow" from select blockchain list step, user has no depositories',
    async () => testSuit.NavigationBackArrowFromStepOne());

  it('Should open select blockchain list page when user press "Back Arrow" from enter blockchain address step, user has no depositories',
    async () => testSuit.NavigationBackArrowFromStepTwo());

  it('Should open enter blockchain address page when user press "Back Arrow" at enter depositories name page',
    async () => testSuit.NavigationBackArrowFromStepThree());

  it('Should open blockchain list step when user press "Back Button" at enter blockchain address step',
    async () => testSuit.NavigationBackButtonFromStepTwo());

  it('Should open enter_address step when user press "Back Button" at enter_name step',
    async () => testSuit.NavigationBackButtonFromStepThree());

  /**
   * Displaying tests
   */

});

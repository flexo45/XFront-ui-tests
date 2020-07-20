import {AppTestFixture} from '../../app.test-fixture';
import {AttachExchangeTests} from '../../tests/attach.exchange';
import {takeScreenshotWhenFail} from '../../utils';

describe('XFront App - Attach Exchange test suite', async () => {

  const fixture: AppTestFixture = new AppTestFixture();
  fixture.defaultUser = fixture.config.users.empty;

  const testSuit: AttachExchangeTests = new AttachExchangeTests(fixture);

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

  for (const exchange of fixture.config.exchanges.array()) {
    it('User should validate api-key and secret of => ' + exchange.name,
      async () => await testSuit.AttachValidateApiKeyAndSecret(exchange));

    it('User should attach new depository => ' + exchange.name ,
      async () => await testSuit.AttachNewDepository(exchange));
  }

  it('User should attach depository of exchange, when it name already exist at depository another user own',
    async () => await testSuit.AttachDepositoryWithAlreadyExistNameAtOtherUserPorfolio());

  it('User should attach depository, when it name already exist at depository another user own, but api keys are different',
    async () => await testSuit.AttachDepositoryWithAlreadyExistNameButDiffKeysAtOtherUserPorfolio());

  /**
   * Attach depository negative tests
   */

  it('App should display error message, when user try attach depository with name already exist at other depository user own',
    async () => await testSuit.ValidationDepoWithSameNameAlreadyExistAtUserOwn());

  it('Should display alerts message if api-key and secret empty',
    async () => testSuit.ValidationApiKeyAndSecretEmpty());

  for (const exchange of [
    { public: '34gfjh6fg5j6h8ghgf8hfg67h', secret: fixture.config.exchanges.binance.secret },
    { public: fixture.config.exchanges.binance.public, secret: 'f8jhgjh6jhgj76778gfhdfh7h8fghf' },
    { public: 'dfgdfhfg6hdfsghdfsg78fdg7dfg7dfg6d', secret: 'f8jhgjh6jhgj76778gfhdfh7h8fghf' }
  ]) {
    it('Should display alerts message if api-key and secret invalid => public=' + exchange.public + ', secret=' + exchange.secret,
      async () => testSuit.ValidationApiKeyOrSecretInvalid(exchange));
  }

  it('Should display alert message if depository name is empty',
    async () => testSuit.ValidationDepositoryNameEmpty());

  for (const exchange of fixture.config.exchanges.array()) {
    it('Should display alert message if exchange with same api key already attached, => ' + exchange.name,
      async () => testSuit.ValidationDepoWithSameApiKeyAlreadyExist(exchange));
  }

  /**
   * Navigation tests
   */

  it('App should open "Welcome page" when user press "Back Arrow" from exchange list, user has no depositories',
    async () => testSuit.NavigationBackArrowFromStepOne());

  it('Should open exchange list page when user press "Back Arrow" from enter exchange api-keys, user has no depositories',
    async () => testSuit.NavigationBackArrowFromStepTwo());

  it('Should open enter exchange api-key page when user press "Back Arrow" at enter depositories name page',
    async () => testSuit.NavigationBackArrowFromStepThree());

  it('Should open enter exchange api-key page when user opened "How to create key"-instruction, then press "Back Arrow" at enter depositories ' +
    'name page', async () => testSuit.NavigationBackArrowSideNavGuideWasOpen());

  it('Should open exchange list page when user press "Back Button" at enter exchange api-key page',
    async () => testSuit.NavigationBackButtonFromStepTwo());

  it('Should open enter_apiKey step when user press "Back Button" at enter_name step',
    async () => testSuit.NavigationBackButtonFromStepThree());

  it('Should open sidenav by clicking to link "Why do you need my API key?" with description text',
    async () => testSuit.NavigationOpenApiKeySidenav());

  /**
   * Displaying tests
   */

  it('Should display message with description about APi Keys, when user have not any depositories',
    async () => testSuit.DisplayMessageAboutApiKeyPortfolioEmpty());

  it('Should display message with description about APi Keys, when user have not any exchange depositories',
    async () => testSuit.DisplayMessageAboutApiKeyProtfolioHaveWallet());

  it('Should display link "Why do you need my API key?" to description text, when user have any exchange depositories',
    async () => testSuit.DisplayLinkAboutApiKey());
});

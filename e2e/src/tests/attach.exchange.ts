import {AppTestFixture} from '../app.test-fixture';
import {ExchangeConfig} from '../test.conf';
import {DepositoryAppPage} from '../app/app.depository.po';

export class TestsBase {
  constructor(protected fixture: AppTestFixture) {

  }

}

export class AttachExchangeTests extends TestsBase {

  private defaultExchange: ExchangeConfig;

  constructor(fixture: AppTestFixture) {
    super(fixture);
    this.defaultExchange = this.fixture.config.exchanges.binance;
  }

  public async AttachValidateApiKeyAndSecret(exchange: ExchangeConfig) {
    // Arrange
    await this.fixture.attachExchange.navigateTo();
    const enterExchangeKeysStep = await this.fixture.attachExchange.selectExchangeStep.clickToExchangeLinkInList(exchange.name);
    // Act
    await enterExchangeKeysStep.apiKeyInput.enterText(exchange.public);
    if (exchange.passphrase) {
      await enterExchangeKeysStep.passphraseInput.enterText(exchange.passphrase);
    }
    await enterExchangeKeysStep.secretInput.enterText(exchange.secret);
    await enterExchangeKeysStep.nextButton.click();
    // Assert
    await this.fixture.attachExchange.enterDepositoryNameStep.assertStepLoadedAndDisplayed();
  }

  public async AttachNewDepository(exchange: ExchangeConfig) {
    // Arrange
    await this.fixture.portfolio.deleteAllDepositoriesOfExchange(exchange);
    await this.fixture.attachExchange.navigateTo();
    const enterExchangeKeysStep = await this.fixture.attachExchange.selectExchangeStep.clickToExchangeLinkInList(exchange.name);
    await enterExchangeKeysStep.apiKeyInput.enterText(exchange.public);
    if (exchange.passphrase) {
      await enterExchangeKeysStep.passphraseInput.enterText(exchange.passphrase);
    }
    await enterExchangeKeysStep.secretInput.enterText(exchange.secret);
    await enterExchangeKeysStep.nextButton.click();
    // Act
    await this.fixture.attachExchange.enterDepositoryNameStep.depositoryNameInput.enterText(' E2E test');
    await this.fixture.attachExchange.enterDepositoryNameStep.addExchangeButton.click();
    // Assert
    // await no_wait_ng(async () => {
    //   await new DepositoryAppPage('', '').assertPageLoaded();
    // });
    await new DepositoryAppPage('', '').assertPageLoaded();
  }

  public async AttachDepositoryWithAlreadyExistNameAtOtherUserPorfolio() {
    const duplicateDepositoryName = 'Duplicated Depository';
    // Arrange
    await this.fixture.relogin(this.fixture.config.users.default);
    // await no_wait_ng(async () => {
    //   await this.fixture.appData.deleteAllDepositoryByApiKey(this.defaultExchange.public);
    //   await this.fixture.appData.deleteAllDepositoryByAnyOneName(duplicateDepositoryName);
    //   await this.fixture._apiClient.createExchangeDepository({
    //     exchange: this.defaultExchange.id,
    //     name: duplicateDepositoryName,
    //     apiKey: this.defaultExchange.public,
    //     apiSecret: this.defaultExchange.secret
    //   });
    // });
    await this.fixture.dbDepositories.deleteAllDepositoryByApiKey(this.defaultExchange.public);
    await this.fixture.dbDepositories.deleteAllDepositoryByAnyOneName(duplicateDepositoryName);
    await this.fixture._apiClient.createExchangeDepository({
      exchange: this.defaultExchange.id,
      name: duplicateDepositoryName,
      apiKey: this.defaultExchange.public,
      apiSecret: this.defaultExchange.secret
    });
    await this.fixture.relogin(this.fixture.defaultUser);

    await this.fixture.attachExchange.navigateTo();
    await this.fixture.attachExchange.selectExchangeStep.clickToExchangeLinkInList(this.defaultExchange.name);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).apiKeyInput.enterText(this.defaultExchange.public);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).secretInput.enterText(this.defaultExchange.secret);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).nextButton.click();
    // Act
    await this.fixture.attachExchange.enterDepositoryNameStep.depositoryNameInput.clearInput();
    await this.fixture.attachExchange.enterDepositoryNameStep.depositoryNameInput.enterText(duplicateDepositoryName);
    await this.fixture.attachExchange.enterDepositoryNameStep.addExchangeButton.click();
    // Assert
    // await no_wait_ng(async () => {
    //   await new DepositoryAppPage('', '').assertPageLoaded();
    // });
    await new DepositoryAppPage('', '').assertPageLoaded();
  }

  public async AttachDepositoryWithAlreadyExistNameButDiffKeysAtOtherUserPorfolio() {
    const duplicateDepositoryName = 'Duplicated Depository';
    const anotherExchange = this.fixture.config.exchanges.bitmex;
    // Arrange
    await this.fixture.relogin(this.fixture.config.users.default);
    // await no_wait_ng(async () => {
    //   await this.fixture.appData.deleteAllDepositoryByApiKey(anotherExchange.public);
    //   await this.fixture.appData.deleteAllDepositoryByAnyOneName(duplicateDepositoryName);
    //   await this.fixture._apiClient.createExchangeDepository({
    //     exchange: anotherExchange.id,
    //     name: duplicateDepositoryName,
    //     apiKey: anotherExchange.public,
    //     apiSecret: anotherExchange.secret
    //   });
    // });
    await this.fixture.dbDepositories.deleteAllDepositoryByApiKey(anotherExchange.public);
    await this.fixture.dbDepositories.deleteAllDepositoryByAnyOneName(duplicateDepositoryName);
    await this.fixture._apiClient.createExchangeDepository({
      exchange: anotherExchange.id,
      name: duplicateDepositoryName,
      apiKey: anotherExchange.public,
      apiSecret: anotherExchange.secret
    });
    await this.fixture.relogin(this.fixture.defaultUser);

    await this.fixture.attachExchange.navigateTo();
    await this.fixture.attachExchange.selectExchangeStep.clickToExchangeLinkInList(this.defaultExchange.name);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).apiKeyInput.enterText(this.defaultExchange.public);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).secretInput.enterText(this.defaultExchange.secret);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).nextButton.click();
    // Act
    await this.fixture.attachExchange.enterDepositoryNameStep.depositoryNameInput.clearInput();
    await this.fixture.attachExchange.enterDepositoryNameStep.depositoryNameInput.enterText(duplicateDepositoryName);
    await this.fixture.attachExchange.enterDepositoryNameStep.addExchangeButton.click();
    // Assert
    // await no_wait_ng(async () => {
    //   await new DepositoryAppPage('', '').assertPageLoaded();
    // });
    await new DepositoryAppPage('', '').assertPageLoaded();
  }

  public async ValidationDepoWithSameNameAlreadyExistAtUserOwn() {
    const duplicateDepositoryName = 'Duplicated Depository';
    const anotherExchange = this.fixture.config.exchanges.bitmex;
    // Arrange
    // await no_wait_ng(async () => {
    //   await this.fixture.appData.deleteAllDepositoryByApiKey(anotherExchange.public);
    //   await this.fixture.appData.deleteAllDepositoryByAnyOneName(duplicateDepositoryName);
    //   await this.fixture._apiClient.createExchangeDepository({
    //     exchange: anotherExchange.id,
    //     name: duplicateDepositoryName,
    //     apiKey: anotherExchange.public,
    //     apiSecret: anotherExchange.secret
    //   });
    // });
    await this.fixture.dbDepositories.deleteAllDepositoryByApiKey(anotherExchange.public);
    await this.fixture.dbDepositories.deleteAllDepositoryByAnyOneName(duplicateDepositoryName);
    await this.fixture._apiClient.createExchangeDepository({
      exchange: anotherExchange.id,
      name: duplicateDepositoryName,
      apiKey: anotherExchange.public,
      apiSecret: anotherExchange.secret
    });

    await this.fixture.attachExchange.navigateTo();
    await this.fixture.attachExchange.selectExchangeStep.clickToExchangeLinkInList(this.defaultExchange.name);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).apiKeyInput.enterText(this.defaultExchange.public);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).secretInput.enterText(this.defaultExchange.secret);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).nextButton.click();

    // Act 1
    await this.fixture.attachExchange.enterDepositoryNameStep.depositoryNameInput.clearInput();
    await this.fixture.attachExchange.enterDepositoryNameStep.depositoryNameInput.enterText(duplicateDepositoryName);
    // Assert 1
    await this.fixture.attachExchange.enterDepositoryNameStep.depositoryNameInput
      .assertErrorText(this.fixture.attachExchange.enterDepositoryNameStep.validation.depositoryNameAlreadyExist);

    // Act 2
    await this.fixture.attachExchange.enterDepositoryNameStep.addExchangeButton.click();
    // Assert 2
    await this.fixture.attachExchange.enterDepositoryNameStep.depositoryNameInput
      .assertErrorText(this.fixture.attachExchange.enterDepositoryNameStep.validation.depositoryNameAlreadyExist);
    await this.fixture.attachExchange.enterDepositoryNameStep.assertStepLoadedAndDisplayed();
  }

  public async NavigationBackArrowFromStepOne() {
    // Arrange
    await this.fixture.page.navigateToRoot();
    await this.fixture.welcome.addExchangeButton.click();
    // Act
    await this.fixture.attachExchange.backArrow.click();
    // Assert
    await this.fixture.welcome.assertPageLoaded();
  }

  public async NavigationBackArrowFromStepTwo() {
    // Arrange
    await this.fixture.page.navigateToRoot();
    await this.fixture.welcome.addExchangeButton.click();
    await this.fixture.attachExchange.selectExchangeStep.clickToExchangeLinkInList(this.defaultExchange.name);
    // Act
    await this.fixture.attachExchange.backArrow.click();
    // Assert
    await this.fixture.attachExchange.selectExchangeStep.assertStepLoadedAndDisplayed();
  }

  public async NavigationBackArrowFromStepThree() {
    // Arrange
    await this.fixture.page.navigateToRoot();
    await this.fixture.welcome.addExchangeButton.click();
    await this.fixture.attachExchange.selectExchangeStep.clickToExchangeLinkInList(this.defaultExchange.name);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).apiKeyInput.enterText(this.fixture.config.exchanges.binance.public);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).secretInput.enterText(this.fixture.config.exchanges.binance.secret);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).nextButton.click();
    // Act
    await this.fixture.attachExchange.backArrow.click();
    // Assert
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).assertStepLoadedAndDisplayed();
  }

  public async NavigationBackButtonFromStepTwo() {
    // Arrange
    await this.fixture.page.navigateToRoot();
    await this.fixture.welcome.addExchangeButton.click();
    await this.fixture.attachExchange.selectExchangeStep.clickToExchangeLinkInList(this.defaultExchange.name);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).assertStepLoadedAndDisplayed();
    // Act
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).backButton.click();
    // Assert
    await this.fixture.attachExchange.selectExchangeStep.assertStepLoadedAndDisplayed();
  }

  public async NavigationBackButtonFromStepThree() {
    // Arrange
    await this.fixture.page.navigateToRoot();
    await this.fixture.welcome.addExchangeButton.click();
    await this.fixture.attachExchange.selectExchangeStep.clickToExchangeLinkInList(this.defaultExchange.name);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).apiKeyInput.enterText(this.defaultExchange.public);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).secretInput.enterText(this.defaultExchange.secret);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).nextButton.click();
    // Act
    await this.fixture.attachExchange.enterDepositoryNameStep.backButton.click();
    // Assert
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).assertStepLoadedAndDisplayed();
  }

  public async NavigationBackArrowSideNavGuideWasOpen() {
    // Arrange
    await this.fixture.page.navigateToRoot();
    await this.fixture.welcome.addExchangeButton.click();
    await this.fixture.attachExchange.selectExchangeStep.clickToExchangeLinkInList(this.defaultExchange.name);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).howToCreateLink.click();
    await this.fixture.attachExchange.guideSideNav.waitForLoading();
    await this.fixture.attachExchange.guideSideNav.close();
    // Act
    await this.fixture.attachExchange.backArrow.click();
    // Assert
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).assertStepLoadedAndDisplayed();
  }

  public async NavigationOpenApiKeySidenav() {
    // Arrange
    // await no_wait_ng(async () => {
    //   await this.fixture._apiClient.createExchangeDepository({
    //     exchange: this.defaultExchange.id,
    //     name: this.defaultExchange.name,
    //     apiKey: this.defaultExchange.public,
    //     apiSecret: this.defaultExchange.secret
    //   });
    // });
    await this.fixture._apiClient.createExchangeDepository({
      exchange: this.defaultExchange.id,
      name: this.defaultExchange.name,
      apiKey: this.defaultExchange.public,
      apiSecret: this.defaultExchange.secret
    });
    await this.fixture.attachExchange.navigateTo();
    await this.fixture.attachExchange.selectExchangeStep.clickToExchangeLinkInList(this.defaultExchange.name);
    // Act
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).whyApiKeyLink.click();
    // Assert
    await this.fixture.attachExchange.whyApiKeySideNav.waitForLoading();

    await this.fixture.attachExchange.whyApiKeySideNav.title.assertText();
    await this.fixture.attachExchange.whyApiKeySideNav.title.assertStyle();

    await this.fixture.attachExchange.whyApiKeySideNav.paragraphFirst.assertText();
    await this.fixture.attachExchange.whyApiKeySideNav.paragraphFirst.assertStyle();

    await this.fixture.attachExchange.whyApiKeySideNav.paragraphSecond.assertText();
    await this.fixture.attachExchange.whyApiKeySideNav.paragraphSecond.assertStyle();
  }

  public async ValidationApiKeyAndSecretEmpty() {
    // Arrange
    await this.fixture.attachExchange.navigateTo();
    await this.fixture.attachExchange.selectExchangeStep.clickToExchangeLinkInList(this.defaultExchange.name);
    // Act
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).nextButton.click();
    // Assert
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).apiKeyInput
      .assertErrorText(this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).validation.apiKeyRequired);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).secretInput
      .assertErrorText(this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).validation.secretRequired);
  }

  public async ValidationApiKeyOrSecretInvalid(exchange: {public: string, secret: string}) {
    const attach = this.fixture.attachExchange;
    // Arrange
    await attach.navigateTo();
    const enterExchangeKeysStep = await attach.selectExchangeStep.clickToExchangeLinkInList(this.defaultExchange.name);
    // Act
    await enterExchangeKeysStep.apiKeyInput.enterText(exchange.public);
    await enterExchangeKeysStep.secretInput.enterText(exchange.secret);
    await enterExchangeKeysStep.nextButton.click();
    // Assert
    await enterExchangeKeysStep.apiKeyInput.assertErrorText('');
    await enterExchangeKeysStep.secretInput.assertErrorText(enterExchangeKeysStep.validation.invalidKeyOrSecret);
  }

  public async ValidationDepositoryNameEmpty() {
    // Arrange
    await this.fixture.attachExchange.navigateTo();
    await this.fixture.attachExchange.selectExchangeStep.clickToExchangeLinkInList(this.defaultExchange.name);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).apiKeyInput.enterText(this.defaultExchange.public);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).secretInput.enterText(this.defaultExchange.secret);
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).nextButton.click();
    // Act
    await this.fixture.attachExchange.enterDepositoryNameStep.depositoryNameInput.clearInput();
    // Assert
    await this.fixture.attachExchange.enterDepositoryNameStep.depositoryNameInput
      .assertErrorText(this.fixture.attachExchange.enterDepositoryNameStep.validation.nameRequires);
  }

  public async ValidationDepoWithSameApiKeyAlreadyExist(exchange: ExchangeConfig) {
    // Arrange
    // await no_wait_ng(async () => {
    //   await this.fixture._apiClient.createExchangeDepository({
    //     exchange: exchange.id,
    //     name: exchange.name,
    //     apiKey: exchange.public,
    //     apiSecret: exchange.secret
    //   });
    // });
    await this.fixture._apiClient.createExchangeDepository({
      exchange: exchange.id,
      name: exchange.name,
      apiKey: exchange.public,
      apiSecret: exchange.secret
    });
    await this.fixture.attachExchange.navigateTo();
    const enterExchangeKeysStep = await this.fixture.attachExchange.selectExchangeStep.clickToExchangeLinkInList(exchange.name);

    // Act 1
    await enterExchangeKeysStep.apiKeyInput.enterText(exchange.public);
    await enterExchangeKeysStep.secretInput.focus();
    // Assert 1
    await enterExchangeKeysStep.apiKeyInput
      .assertErrorText(enterExchangeKeysStep.validation.exchangeWithKeyAlreadyAdded);

    // Act 2
    await enterExchangeKeysStep.secretInput.enterText(exchange.secret);
    // Assert 2
    await enterExchangeKeysStep.apiKeyInput
      .assertErrorText(enterExchangeKeysStep.validation.exchangeWithKeyAlreadyAdded);

    // Act 3
    await enterExchangeKeysStep.nextButton.click();
    // Assert 3
    await enterExchangeKeysStep.apiKeyInput
      .assertErrorText(enterExchangeKeysStep.validation.exchangeWithKeyAlreadyAdded);
    await enterExchangeKeysStep.assertStepLoadedAndDisplayed();
  }

  public async DisplayMessageAboutApiKeyPortfolioEmpty() {
    await this.fixture.attachExchange.navigateTo();
    // Act
    await this.fixture.attachExchange.selectExchangeStep.clickToExchangeLinkInList(this.defaultExchange.name);
    // Assert
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).whyApiKeyLink.assertNotPresented();
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).whyApiKeyText[0].assertText();
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).whyApiKeyText[0].assertStyle();
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).whyApiKeyText[1].assertText();
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).whyApiKeyText[1].assertStyle();
  }

  public async DisplayMessageAboutApiKeyProtfolioHaveWallet() {
    // Arrange
    // await no_wait_ng(async () => {
    //   await this.fixture._apiClient.createWalletDepository({
    //     addressInBlockchain: this.fixture.config.wallets.bitcoin.address,
    //     blockchain: this.fixture.config.wallets.bitcoin.id,
    //     name: this.fixture.config.wallets.bitcoin.name
    //   });
    // });
    await this.fixture._apiClient.createWalletDepository({
      addressInBlockchain: this.fixture.config.wallets.bitcoin.address,
      blockchain: this.fixture.config.wallets.bitcoin.id,
      name: this.fixture.config.wallets.bitcoin.name
    });
    await this.fixture.attachExchange.navigateTo();
    // Act
    await this.fixture.attachExchange.selectExchangeStep.clickToExchangeLinkInList(this.defaultExchange.name);
    // Assert
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).whyApiKeyLink.assertNotPresented();
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).whyApiKeyText[0].assertText();
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).whyApiKeyText[0].assertStyle();
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).whyApiKeyText[1].assertText();
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).whyApiKeyText[1].assertStyle();
  }

  public async DisplayLinkAboutApiKey() {
    // Arrange
    // await no_wait_ng(async () => {
    //   await this.fixture._apiClient.createExchangeDepository({
    //     exchange: this.defaultExchange.id,
    //     name: this.defaultExchange.name,
    //     apiKey: this.defaultExchange.public,
    //     apiSecret: this.defaultExchange.secret
    //   });
    // });
    await this.fixture._apiClient.createExchangeDepository({
      exchange: this.defaultExchange.id,
      name: this.defaultExchange.name,
      apiKey: this.defaultExchange.public,
      apiSecret: this.defaultExchange.secret
    });
    await this.fixture.attachExchange.navigateTo();
    // Act
    await this.fixture.attachExchange.selectExchangeStep.clickToExchangeLinkInList(this.defaultExchange.name);
    // Assert
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).whyApiKeyLink.assertIsPresented();
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).whyApiKeyText[0].assertNotPresented();
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).whyApiKeyText[1].assertNotPresented();

    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).whyApiKeyLink.assertText();
    await this.fixture.attachExchange.enterExchangeKeysStep(this.defaultExchange.name).whyApiKeyLink.assertStyle();
  }

}



// export async function SingleTest (name: string, testMethodFunc: () => Promise<void>) {
//   it(name, await testMethodFunc());
// }
//
// export async function DataDrivenTest<T> (getTestNameFunc: (d: T) => string, data: T[], testMethodFunc: (d: T) => Promise<void>) {
//  for (const d: T of data) {
//    it(getTestNameFunc(d), await testMethodFunc(d));
//  }
// }

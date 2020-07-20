import {AppTestFixture} from '../app.test-fixture';
import {WalletConfig} from '../test.conf';
import {TestsBase} from './attach.exchange';
import {DepositoryAppPage} from '../app/app.depository.po';

export class AttachWalletTests extends TestsBase {

  private defaultWallet: WalletConfig;

  constructor(fixture: AppTestFixture) {
    super(fixture);
    this.defaultWallet = this.fixture.config.wallets.bitcoin;
  }

  public async AttachValidateAddress(wallet: WalletConfig) {
    // Arrange
    await this.fixture.attachWallet.navigateTo();
    await this.fixture.attachWallet.selectBlockchainStep.clickToBlockchainLinkInList(wallet.name);
    // Act
    await this.fixture.attachWallet.enterBlockchainAddressStep(wallet.name).addressInput.enterText(wallet.address);
    await this.fixture.attachWallet.enterBlockchainAddressStep(wallet.name).nextButton.click();
    // Assert
    await this.fixture.attachWallet.enterDepositoryNameStep.assertStepLoadedAndDisplayed();
  }

  public async AttachWalletToPortfolio(wallet: WalletConfig) {
    // Arrange
    await this.fixture.attachWallet.navigateTo();
    await this.fixture.attachWallet.selectBlockchainStep.clickToBlockchainLinkInList(wallet.name);
    await this.fixture.attachWallet.enterBlockchainAddressStep(wallet.name).addressInput.enterText(wallet.address);
    await this.fixture.attachWallet.enterBlockchainAddressStep(wallet.name).nextButton.click();
    // Act
    await this.fixture.attachWallet.enterDepositoryNameStep.depositoryNameInput.enterText(' E2E test');
    await this.fixture.attachWallet.enterDepositoryNameStep.addAddressButton.click();
    // Assert
    // await no_wait_ng(async () => {
    //   await new DepositoryAppPage('', '').assertPageLoaded();
    // });
    await new DepositoryAppPage('', '').assertPageLoaded();
  }

  public async AttachDepositoryWithAlreadyExistNameAtOtherUserPortfolio() {
    const duplicateDepositoryName = 'Duplicated Depository';
    // Arrange
    await this.fixture.relogin(this.fixture.config.users.default);
    // await no_wait_ng(async () => {
    //   await this.fixture.appData.deleteAllDepositoryByAddress(this.defaultWallet.address);
    //   await this.fixture.appData.deleteAllDepositoryByAnyOneName(duplicateDepositoryName);
    //   await this.fixture._apiClient.createWalletDepository({
    //     blockchain: this.defaultWallet.id,
    //     name: duplicateDepositoryName,
    //     addressInBlockchain: this.defaultWallet.address
    //   });
    // });
    await this.fixture.relogin(this.fixture.defaultUser);

    await this.fixture.attachWallet.navigateTo();
    const enterBlockchainAddressStep = await this.fixture.attachWallet.selectBlockchainStep.clickToBlockchainLinkInList(this.defaultWallet.name);
    await enterBlockchainAddressStep.addressInput.enterText(this.defaultWallet.address);
    await enterBlockchainAddressStep.nextButton.click();
    // Act
    await this.fixture.attachWallet.enterDepositoryNameStep.depositoryNameInput.clearInput();
    await this.fixture.attachWallet.enterDepositoryNameStep.depositoryNameInput.enterText(duplicateDepositoryName);
    await this.fixture.attachWallet.enterDepositoryNameStep.addAddressButton.click();
    // Assert
    // await no_wait_ng(async () => {
    //   await new DepositoryAppPage('', '').assertPageLoaded();
    // });
    await new DepositoryAppPage('', '').assertPageLoaded();
  }

  public async AttachDepositoryWithAlreadyExistNameButDiffAddressAtOtherUserPortfolio() {
    const duplicateDepositoryName = 'Duplicated Depository';
    const anotherWallet = this.fixture.config.wallets.ethereum;
    // Arrange
    await this.fixture.relogin(this.fixture.config.users.default);
    // await no_wait_ng(async () => {
    //   await this.fixture.appData.deleteAllDepositoryByAddress(anotherWallet.address);
    //   await this.fixture.appData.deleteAllDepositoryByAnyOneName(duplicateDepositoryName);
    //   await this.fixture._apiClient.createWalletDepository({
    //     blockchain: anotherWallet.id,
    //     name: duplicateDepositoryName,
    //     addressInBlockchain: anotherWallet.address
    //   });
    // });
    await this.fixture.dbDepositories.deleteAllDepositoryByAddress(anotherWallet.address);
    await this.fixture.dbDepositories.deleteAllDepositoryByAnyOneName(duplicateDepositoryName);
    await this.fixture._apiClient.createWalletDepository({
      blockchain: anotherWallet.id,
      name: duplicateDepositoryName,
      addressInBlockchain: anotherWallet.address
    });
    await this.fixture.relogin(this.fixture.defaultUser);

    await this.fixture.attachWallet.navigateTo();
    const enterBlockchainAddressStep = await this.fixture.attachWallet.selectBlockchainStep.clickToBlockchainLinkInList(this.defaultWallet.name);
    await enterBlockchainAddressStep.addressInput.enterText(this.defaultWallet.address);
    await enterBlockchainAddressStep.nextButton.click();
    // Act
    await this.fixture.attachWallet.enterDepositoryNameStep.depositoryNameInput.clearInput();
    await this.fixture.attachWallet.enterDepositoryNameStep.depositoryNameInput.enterText(duplicateDepositoryName);
    await this.fixture.attachWallet.enterDepositoryNameStep.addAddressButton.click();
    // Assert
    // await no_wait_ng(async () => {
    //   await new DepositoryAppPage('', '').assertPageLoaded();
    // });
    await new DepositoryAppPage('', '').assertPageLoaded();
  }

  public async NavigationBackArrowFromStepOne() {
    await this.fixture.page.navigateToRoot();
    await this.fixture.welcome.addAddressButton.click();
    await this.fixture.attachWallet.selectBlockchainStep.assertStepLoadedAndDisplayed();
    // Act
    await this.fixture.attachWallet.backArrow.click();
    // Assert
    await this.fixture.welcome.assertPageLoaded();
  }

  public async NavigationBackArrowFromStepTwo() {
    await this.fixture.page.navigateToRoot();
    await this.fixture.welcome.addAddressButton.click();
    await this.fixture.attachWallet.selectBlockchainStep.clickToBlockchainLinkInList(this.defaultWallet.name);
    // Act
    await this.fixture.attachWallet.backArrow.click();
    // Assert
    await this.fixture.attachWallet.selectBlockchainStep.assertStepLoadedAndDisplayed();
  }

  public async NavigationBackButtonFromStepTwo() {
    await this.fixture.page.navigateToRoot();
    await this.fixture.welcome.addAddressButton.click();
    await this.fixture.attachWallet.selectBlockchainStep.clickToBlockchainLinkInList(this.defaultWallet.name);
    // Act
    await this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name).backButton.click();
    // Assert
    await this.fixture.attachWallet.selectBlockchainStep.assertStepLoadedAndDisplayed();
  }

  public async NavigationBackArrowFromStepThree() {
    await this.fixture.page.navigateToRoot();
    await this.fixture.welcome.addAddressButton.click();
    await this.fixture.attachWallet.selectBlockchainStep.clickToBlockchainLinkInList(this.defaultWallet.name);
    await this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name).addressInput.enterText(this.defaultWallet.address);
    await this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name).nextButton.click();
    // Act
    await this.fixture.attachWallet.backArrow.click();
    // Assert
    await this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name).assertStepLoadedAndDisplayed();
  }

  public async NavigationBackButtonFromStepThree() {
    // Arrange
    await this.fixture.page.navigateToRoot();
    await this.fixture.welcome.addAddressButton.click();
    await this.fixture.attachWallet.selectBlockchainStep.clickToBlockchainLinkInList(this.defaultWallet.name);
    await this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name).addressInput.enterText(this.defaultWallet.address);
    await this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name).nextButton.click();
    // Act
    await this.fixture.attachWallet.enterDepositoryNameStep.backButton.click();
    // Assert
    await this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name).assertStepLoadedAndDisplayed();
  }

  public async ValidationAddressEmpty() {
    // Arrange
    await this.fixture.attachWallet.navigateTo();
    await this.fixture.attachWallet.selectBlockchainStep.clickToBlockchainLinkInList(this.defaultWallet.name);
    // Act
    await this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name).nextButton.click();
    // Assert
    await this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name).addressInput
      .assertErrorText(this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name).validation.addressRequired);
  }

  public async ValidationAddressInvalid(wallet: WalletConfig) {
    // Arrange
    await this.fixture.attachWallet.navigateTo();
    await this.fixture.attachWallet.selectBlockchainStep.clickToBlockchainLinkInList(wallet.name);
    // Act
    await this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name).addressInput.enterText(wallet.address);
    await this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name).nextButton.click();
    // Assert
    await this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name).addressInput
      .assertErrorText(this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name)
        .validation.addressInvalid.replace('{0}', wallet.name));
  }

  public async ValidationDepositoryNameEmpty() {
    // Arrange
    await this.fixture.attachWallet.navigateTo();
    await this.fixture.attachWallet.selectBlockchainStep.clickToBlockchainLinkInList(this.defaultWallet.name);
    await this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name).addressInput.enterText(this.defaultWallet.address);
    await this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name).nextButton.click();
    // Act
    await this.fixture.attachWallet.enterDepositoryNameStep.depositoryNameInput.clearInput();
    // Assert
    await this.fixture.attachWallet.enterDepositoryNameStep.depositoryNameInput
      .assertErrorText(this.fixture.attachWallet.enterDepositoryNameStep.validation.nameRequires);
  }

  public async ValidationAddressAlreadyAttachedToPortfolio() {
    // Arrange
    // await no_wait_ng(async () => {
    //   await this.fixture._apiClient.createWalletDepository({
    //     addressInBlockchain: this.defaultWallet.address,
    //     blockchain: this.defaultWallet.id,
    //     name: this.defaultWallet.name
    //   });
    // });
    await this.fixture._apiClient.createWalletDepository({
      addressInBlockchain: this.defaultWallet.address,
      blockchain: this.defaultWallet.id,
      name: this.defaultWallet.name
    });
    await this.fixture.attachWallet.navigateTo();
    await this.fixture.attachWallet.selectBlockchainStep.clickToBlockchainLinkInList(this.defaultWallet.name);
    // Act
    await this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name).addressInput.enterText(this.defaultWallet.address);
    await this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name).nextButton.click();
    // Assert
    await this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name).addressInput
      .assertErrorText(this.fixture.attachWallet.enterBlockchainAddressStep(this.defaultWallet.name).validation.walletWithAddressAlreadyAdded);
  }

  public async ValidationDepoWithSameNameAlreadyExistAtUserOwn() {
    const duplicateDepositoryName = 'Duplicated Depository';
    const anotherWallet = this.fixture.config.wallets.ethereum;
    // Arrange
    // await no_wait_ng(async () => {
    //   await this.fixture.appData.deleteAllDepositoryByAddress(anotherWallet.address);
    //   await this.fixture.appData.deleteAllDepositoryByAnyOneName(duplicateDepositoryName);
    //   await this.fixture._apiClient.createWalletDepository({
    //     blockchain: anotherWallet.id,
    //     name: duplicateDepositoryName,
    //     addressInBlockchain: anotherWallet.address
    //   });
    // });
    await this.fixture.dbDepositories.deleteAllDepositoryByAddress(anotherWallet.address);
    await this.fixture.dbDepositories.deleteAllDepositoryByAnyOneName(duplicateDepositoryName);
    await this.fixture._apiClient.createWalletDepository({
      blockchain: anotherWallet.id,
      name: duplicateDepositoryName,
      addressInBlockchain: anotherWallet.address
    });

    await this.fixture.attachWallet.navigateTo();
    const enterBlockchainAddressStep = await this.fixture.attachWallet.selectBlockchainStep.clickToBlockchainLinkInList(this.defaultWallet.name);
    await enterBlockchainAddressStep.addressInput.enterText(this.defaultWallet.address);
    await enterBlockchainAddressStep.nextButton.click();

    // Act 1
    await this.fixture.attachWallet.enterDepositoryNameStep.depositoryNameInput.clearInput();
    await this.fixture.attachWallet.enterDepositoryNameStep.depositoryNameInput.enterText(duplicateDepositoryName);
    // Assert 1
    await this.fixture.attachWallet.enterDepositoryNameStep.depositoryNameInput
      .assertErrorText(this.fixture.attachWallet.enterDepositoryNameStep.validation.depositoryNameAlreadyExist);

    // Act 2
    await this.fixture.attachWallet.enterDepositoryNameStep.addAddressButton.click();
    // Assert 2
    await this.fixture.attachWallet.enterDepositoryNameStep.depositoryNameInput
      .assertErrorText(this.fixture.attachWallet.enterDepositoryNameStep.validation.depositoryNameAlreadyExist);
    await this.fixture.attachWallet.enterDepositoryNameStep.assertStepLoadedAndDisplayed();
  }

}

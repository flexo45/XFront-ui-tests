import {browser, by, element} from 'protractor';
import {BasePageObjectApp} from './app.base.po';
import {FormFieldPageObjectComponent} from './componets/form-field.po';
import {BackArrowButtonPageObjectComponent, ButtonDarkAccentPageObjectComponent, ButtonFillAccentPageObjectComponent} from './componets/buttons.po';
import {StepPageObjectComponent} from './componets/step.po';

export class AttachWalletDepositoryAppPage extends BasePageObjectApp {

  constructor() {
    super('/wallet/attach');
  }

  public selectBlockchainStep = new SelectBlockchainStep();

  public enterDepositoryNameStep = new EnterDepositoryNameStep();

  public backArrow = new BackArrowButtonPageObjectComponent('app-attach');

  public enterBlockchainAddressStep(blockchainName: string) {
    return new EnterBlockchainAddressStep(blockchainName);
  }

  async assertPageLoaded() {
    await this.checkForErrorMessageOnLoad();
    await this.selectBlockchainStep.header.assertIsPresented();
  }
}

export enum Blockchain {
  Unknown = 0,
  Bitcoin = 1,
  Ethereum = 2
}

class SelectBlockchainStep extends StepPageObjectComponent {

  constructor() {
    super('#step-1', 'Choose blockchain');
  }

  async clickToBlockchainLinkInList(walletName: string): Promise<EnterBlockchainAddressStep> {
    (await this.getBlockchainLinkInList(walletName)).click();
    await browser.sleep(500);
    return new EnterBlockchainAddressStep(walletName);
  }

  async getBlockchainLinkInList(walletName: string) {
    return await element(by.xpath(`//form[@id='${this.id}']//span[contains(text(),'${walletName}')]/parent::button`));
  }
}

class EnterBlockchainAddressStep extends StepPageObjectComponent {

  constructor(blockchainName: string) {
    super('#step-2', `Enter ${blockchainName} address`);
  }

  public validation = {
    addressRequired: 'Address required',
    addressInvalid: 'Address is invalid for {0} blockchain',
    walletWithAddressAlreadyAdded: 'You have already attached a blockchain with same address'
  };

  public addressInput = new FormFieldPageObjectComponent(`${this.basePath} %`, 'addressInBlockchain',
    'Enter the blockchain address of your wallet');
  public backButton = new ButtonDarkAccentPageObjectComponent('#step-2-back', 'Back');
  public nextButton = new ButtonFillAccentPageObjectComponent('#step-2-next', 'Next');
}

class EnterDepositoryNameStep extends StepPageObjectComponent {

  constructor() {
    super('#step-3', 'Give name');
  }

  validation = {
    nameRequires: 'Wallet name required',
    depositoryNameAlreadyExist: 'Depository with same name already added'
  };

  public depositoryNameInput = new FormFieldPageObjectComponent(`${this.basePath} %`, 'name',
    'Give a name to your blockchain address');

  public backButton = new ButtonDarkAccentPageObjectComponent('#step-2-back', 'Back');
  public addAddressButton = new ButtonFillAccentPageObjectComponent('#step-3-save', 'Add address');
}

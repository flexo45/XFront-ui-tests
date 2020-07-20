import { browser, by, element} from 'protractor';
import {BasePageObjectApp} from './app.base.po';
import {LinkPageObjectComponent} from './componets/link.po';
import {BackArrowButtonPageObjectComponent, ButtonDarkAccentPageObjectComponent, ButtonFillAccentPageObjectComponent} from './componets/buttons.po';
import {StepPageObjectComponent} from './componets/step.po';
import {MutedTextPageObjectComponent, RegularTextPageObjectComponent} from './componets/text.po';
import {SideNavBaseComponentPageObject} from './componets/side-nav.po';
import {FormFieldPageObjectComponent} from './componets/form-field.po';

export class AttachExchangeDepositoryAppPage extends BasePageObjectApp {

  constructor() {
    super('/exchange/attach');
  }

  public guideSideNav = new GuideSideNavComponentPageObject();

  public whyApiKeySideNav = new WhyApiKeySideNavComponentPageObject();

  public backArrow = new BackArrowButtonPageObjectComponent('app-attach');

  public selectExchangeStep = new SelectExchangeStep();

  public enterDepositoryNameStep = new EnterDepositoryNameStep();

  public enterExchangeKeysStep(exchangeName: string): EnterExchangeKeysStep {
    return new EnterExchangeKeysStep(exchangeName);
  }

  async assertPageLoaded() {
    await this.checkForErrorMessageOnLoad();
    await this.selectExchangeStep.header.assertIsPresented();
  }
}

export enum Exchanges {
  Unknown = 0,
  Binance = 1,
  Bitfinex = 2,
  Bitmex = 3,
  Bittrex = 4,
  HitBtc = 5,
  Kraken = 6,
  KuCoin = 7,
Poloniex = 8
}

class SelectExchangeStep extends StepPageObjectComponent {

  constructor() {
    super('#step-1', 'Choose exchange');
  }

  async clickToExchangeLinkInList(exchangeName: string): Promise<EnterExchangeKeysStep> {
    const exchange = await this.getExchangeLinkInList(exchangeName);
    await exchange.click();
    await browser.sleep(500);
    return new EnterExchangeKeysStep(exchangeName);
  }

  async getExchangeLinkInList(exchangeName: string) {
    return await element(by.xpath(`//form[@id='${this.id}']//span[contains(text(),'${exchangeName}')]/parent::button`));
  }
}

class EnterExchangeKeysStep extends StepPageObjectComponent {

  constructor(private exchangeName: string) {
    super('#step-2', `Enter ${exchangeName} API key`);
  }

  public validation = {
    apiKeyRequired: 'Api Key required',
    secretRequired: 'Secret required',
    invalidKeyOrSecret: 'Invalid API key or Secret',
    exchangeWithKeyAlreadyAdded: 'Exchange with same API key already added'
  };

  public whyApiKeyText = [
    new MutedTextPageObjectComponent(`${this.basePath} h1 + div %`, 'An API key is a way for you to share some information with XFront without' +
      ' giving away your credentials. We ask you to provide an API key so that we can automatically collect information about your coin account ' +
      'balances on a certain exchange – and nothing else.', '16px'),
    new MutedTextPageObjectComponent(`${this.basePath} h1 + div + div %`, 'The access you grant us is READ-ONLY: our system cannot do absolutely ' +
      'anything with your API key apart from fetching your crypto account balance and feeding it into your user area in XFront.', '16px')
  ];
  public whyApiKeyLink = new LinkPageObjectComponent('#step-2 %', '/exchange/attach(sidenav:guide/apikey/usage/information)',
    'Why do you need my API key?');
  public howToCreateLink = new LinkPageObjectComponent('#step-2 %', '/exchange/attach(sidenav:guide/apikey/create',
    'Where can I find API key?');

  public backButton = new ButtonDarkAccentPageObjectComponent('#step-2-back', 'Back');
  public nextButton = new ButtonFillAccentPageObjectComponent('#step-2-next', 'Next');
  public apiKeyInput = new FormFieldPageObjectComponent(`${this.basePath} %`, 'key', 'API key');
  public passphraseInput = new FormFieldPageObjectComponent(`${this.basePath} %`, 'passphrase', 'API passphrase');
  public secretInput = new FormFieldPageObjectComponent(`${this.basePath} %`, 'secret', 'Secret');
}

class EnterDepositoryNameStep extends StepPageObjectComponent {

  constructor() {
    super('#step-3', 'Give name');
  }

  public validation = {
    nameRequires: 'Name required',
    depositoryNameAlreadyExist: 'Depository with same name already added'
  };

  public backButton = new ButtonDarkAccentPageObjectComponent('#step-3-back', 'Back');
  public addExchangeButton = new ButtonFillAccentPageObjectComponent('#step-3-save', 'Next');
  public depositoryNameInput = new FormFieldPageObjectComponent(`${this.basePath} %`, 'name', 'Give a name to your exchange a');
}

class GuideSideNavComponentPageObject extends SideNavBaseComponentPageObject {
  constructor() {
    super('How to create API key');
  }
}

class WhyApiKeySideNavComponentPageObject extends SideNavBaseComponentPageObject {
  constructor() {
    super('Why do you need my API key?');
  }

  public paragraphFirst = new RegularTextPageObjectComponent(`!${this.basePath} h2 + div`,
    'An API key is a way for you to share some information with XFront ' +
    'without giving away your credentials. We ask you to provide an API key so that we can automatically collect information about your coin account ' +
    'balances on a certain exchange – and nothing else.', '16px');

  public paragraphSecond = new RegularTextPageObjectComponent(`!${this.basePath} h2 + div + div`, 'The access you grant us is READ-ONLY: our system cannot' +
    ' do absolutely anything with your API key apart from fetching your crypto account balance and feeding it into your user area in XFront.',
    '16px');
}

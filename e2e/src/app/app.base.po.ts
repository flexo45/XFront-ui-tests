import {browser, by, element} from 'protractor';
import {TestConf} from '../test.conf';
import {PortfolioHeaderPageObjectComponent} from './componets/portfolio-header.po';
import {MenuItemPageObjectComponent} from './componets/menu-item.po';
import {MutedTextPageObjectComponent, RegularTextPageObjectComponent} from './componets/text.po';
import {SvgIconPageObjectComponent} from './componets/svg-icon.po';

export class HeaderAppComponentPageObject {

  protected config = new TestConf();
  protected styles = this.config.styles;
  protected basePath = 'app-header';

  public signOutText = new SvgIconPageObjectComponent(`${this.basePath} .sign-out`, ['M16 0H2C0.89 0 0 0.89 0 2V6H2V2H16V16H2V12H0V16C0 16.5304' +
  ' 0.210714 17.0391 0.585786 17.4142C0.960859 17.7893 1.46957 18 2 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V2C18' +
  ' 0.89 17.1 0 16 0ZM7.08 12.58L8.5 14L13.5 9L8.5 4L7.08 5.41L9.67 8H0V10H9.67L7.08 12.58Z']);

  public currenciesMenuItem = new MenuItemPageObjectComponent(this.basePath, '/', 'Currencies');

  public depositoriesMenuItem = new MenuItemPageObjectComponent(this.basePath, '/depositories', 'Depositories');
}

export class AppPageObject extends HeaderAppComponentPageObject {

  constructor() {
    super();
  }

  async navigateToRoot() {
    await browser.get('/');
  }

}

export abstract class BasePageObjectApp extends HeaderAppComponentPageObject {

  protected constructor(protected urlPath: string) {
    super();
  }

  async navigateTo() {
    await browser.get(this.urlPath);
  }

  async checkForErrorMessageOnLoad() {
    const errorNotify = element(by.css('p-toastitem > div'));
    expect(errorNotify.isPresent()).toBeFalsy(`error notification detected: {await errorNotify.getText()}`);
  }

  abstract async assertPageLoaded();
}

export class PortfolioBasePageObjectApp extends BasePageObjectApp {
  constructor(protected urlPath: string, protected pageTitle: string, protected basePath, protected headerComponentName: string) {
    super(urlPath);
  }

  public balanceHeader = new PortfolioHeaderPageObjectComponent(this.basePath, this.headerComponentName, this.pageTitle);

  public async switchDeltaMode(deltaMode: string) {
    const currentMode = await this.getCurrentDeltaMode();
    if (currentMode !== deltaMode) {
      await this.balanceHeader.deltaValue.switchDeltaValueMode();
    }
  }

  public async getCurrentPeriod(): Promise<string> {
    return (await this.balanceHeader.deltaPeriodSelector.active.el.getText()).trim();
  }

  public async getCurrentDeltaMode(): Promise<string> {
    const currentDeltaValue = await this.balanceHeader.deltaValue.base.el.getText();
    if (currentDeltaValue.includes('%')) {
      return 'relative';
    } else {
      return 'absolute';
    }
  }

  public async getSelectedCurrencyName(): Promise<string> {
    return await this.balanceHeader.portfolioBalance.currencyIcon.ticker();
  }

  public async assertPageLoaded() {
    await this.checkForErrorMessageOnLoad();
    await this.balanceHeader.assertIsPresented();
  }
}

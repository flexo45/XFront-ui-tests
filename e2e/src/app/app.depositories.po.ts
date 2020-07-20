import {PortfolioBasePageObjectApp} from './app.base.po';
import {by, element, ElementFinder} from 'protractor';
import {DepositoryListPageObjectComponent} from './componets/depository-list.po';
import {ButtonDarkAccentPageObjectComponent} from './componets/buttons.po';
import {H1HeaderPageObjectComponent, MutedTextPageObjectComponent, RegularTextPageObjectComponent} from './componets/text.po';

export class DepositoriesAppPage extends PortfolioBasePageObjectApp {

  constructor() {
    super('/depositories', 'Your balance', 'app-depositories-portfolio', 'app-portfolio-header');
  }

  public syncingStateView = {
    page: this,
    title: new RegularTextPageObjectComponent(`${this.basePath} ${this.headerComponentName}`, `Your portfolio is`, '16px'),
    syncing: new H1HeaderPageObjectComponent(`${this.basePath} ${this.headerComponentName}`, 'Syncing'),
    async assertPageLoaded() {
      await this.page.checkForErrorMessageOnLoad();
      await this.syncing.assertIsPresented();
    }
  };

  public emptyStateView = {
    page: this,
    title: new RegularTextPageObjectComponent(`${this.basePath} ${this.headerComponentName}`, `Your portfolio is`, '16px'),
    empty: new H1HeaderPageObjectComponent(`${this.basePath} ${this.headerComponentName}`, 'Empty'),
    async assertPageLoaded() {
      await this.page.checkForErrorMessageOnLoad();
      await this.empty.assertIsPresented();
    }
  };

  public depositoryList = new DepositoryListPageObjectComponent(`${this.basePath}`);

  public addExchangeButton = new ButtonDarkAccentPageObjectComponent('app-depositories-portfolio #add-exchange', 'Add exchange');
  public addAddressButton = new ButtonDarkAccentPageObjectComponent('app-depositories-portfolio #add-wallet', 'Add address');

  async getAllDepositoriesId(): Promise<string[]> {
    const all = await element.all(by.css('app-depositories-list > div.d-none app-depository-item a.d-none'));
    const result = [];
    for (const el of all) {
      result.push(await this.getIdFromHrefAttributeAsync(el));
    }
    return result;
  }

  private async getIdFromHrefAttributeAsync(el: ElementFinder): Promise<string> {
    const hrefValue = await el.getAttribute('href');
    return hrefValue.replace(/http.+\/depository\//g, '');
  }
}

import {PortfolioBasePageObjectApp} from './app.base.po';
import {CurrencyListPageObjectComponent} from './componets/currency-list.po';
import {H1HeaderPageObjectComponent, RegularTextPageObjectComponent} from './componets/text.po';
import {ButtonDarkAccentPageObjectComponent} from './componets/buttons.po';

export class CurrenciesAppPage extends PortfolioBasePageObjectApp {

  constructor() {
    super('/', 'Your balance', 'app-currencies-portfolio', 'app-portfolio-header');

  }

  public syncingStateView = {
    page: this,
    title: new RegularTextPageObjectComponent(`${this.basePath} ${this.headerComponentName}`, `Your portfolio is`),
    syncing: new H1HeaderPageObjectComponent(`${this.basePath} ${this.headerComponentName} `, 'Syncing'),
    description: new RegularTextPageObjectComponent(`${this.basePath} > div.margin-from-header div >`,
      'We are syncing your portfolio right now. Please wait. It will be updated shortly...'),
    async assertPageLoaded() {
      await this.page.checkForErrorMessageOnLoad();
      await this.syncing.assertIsPresented();
    }
  };

  public emptyStateView = {
    page: this,
    title: new RegularTextPageObjectComponent(`${this.basePath} ${this.headerComponentName} `, `Your portfolio is`),
    empty: new H1HeaderPageObjectComponent(`${this.basePath} ${this.headerComponentName} `, 'Empty'),
    description: new RegularTextPageObjectComponent(`${this.basePath} > div.margin-from-header div >`,
      'We didn\'t find any cryptocurrency in your portfolio. If you have another depositories with cryptocurrency you can add them to track their balance.'),
    addExchangeButton: new ButtonDarkAccentPageObjectComponent('app-currencies-portfolio #add-exchange', 'Add exchange'),
    addAddressButton: new ButtonDarkAccentPageObjectComponent('app-currencies-portfolio #add-wallet', 'Add address'),
    async assertPageLoaded() {
      await this.page.checkForErrorMessageOnLoad();
      await this.empty.assertIsPresented();
    }
  };

  public currenciesList = new CurrencyListPageObjectComponent(``);
}

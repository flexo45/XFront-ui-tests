import {PortfolioBasePageObjectApp} from './app.base.po';
import {BackArrowButtonPageObjectComponent} from './componets/buttons.po';
import {RegularTextPageObjectComponent} from './componets/text.po';
import {PriceNumberPageObjectComponent} from './componets/price-number.po';
import {AmountNumberPageObjectComponent} from './componets/amount-number.po';
import {CurrencyDetailDepositoryListPageObjectComponent} from './componets/currency-detail-depository-list.po';

export class CurrencyPageObjectApp extends PortfolioBasePageObjectApp {

  constructor(public currencyName: string, public currencyId: string) {
    super(`/currency/${currencyId}`, currencyName, 'app-currency-details', '> div.d-none app-currency-details-header');
    // this.balanceHeader.text = new RegularTextPageObjectComponent(`${this.basePath}  > div.d-none app-currency-details-header .regular-text bold > div >`,
    //   currencyName);
  }

  public backArrow = new BackArrowButtonPageObjectComponent(this.basePath);

  public price = {
    text: new RegularTextPageObjectComponent(`!${this.basePath} ${this.headerComponentName} .currency-details > span:nth-child(1)`, 'Price - '),
    number: new PriceNumberPageObjectComponent(`${this.basePath} ${this.headerComponentName} .currency-details > span:nth-child(1)`)
  };

  public total = {
    text: new RegularTextPageObjectComponent(`!${this.basePath} ${this.headerComponentName} .currency-details > span:nth-child(2)`, 'Total - '),
    number: new AmountNumberPageObjectComponent(`${this.basePath} ${this.headerComponentName} .currency-details > span:nth-child(2)`)
  };

  public depositoryList = new CurrencyDetailDepositoryListPageObjectComponent(`${this.basePath}`);
}

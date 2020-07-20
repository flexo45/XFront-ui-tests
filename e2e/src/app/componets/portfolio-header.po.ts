import {BasePageObjectComponent} from './base.po';
import {TextBasePageObjectComponent} from './base-text.po';
import {CurrencySelectorPageObjectComponent} from './currency-selector.po';
import {PortfolioBalancePageObjectComponent} from './portfolio-balance.po';
import {DeltaValueHistorySelectorPageObjectComponent} from './delta-value-history-selector.po';
import {DeltaValueSwitcherPageObjectComponent} from './delta-value-mode-switcher.po';
import {RegularTextPageObjectComponent} from './text.po';

export class PortfolioHeaderPageObjectComponent extends BasePageObjectComponent {

  // protected headerBasePath: string;
  // protected headerComponentName: string;

  constructor(basePath: string, componentName: string, private title: TextBasePageObjectComponent | string) {
    super(basePath, componentName);
    // this.headerBasePath = basePath;
    // this.headerComponentName = componentName;

    if (this.title.constructor.name === 'String') {
      this.text = new RegularTextPageObjectComponent(`${this.basePath} .depository-name-container > `,
      this.title.toString(), '16px');
    } else {
      this.text = this.title as TextBasePageObjectComponent;
    }
  }

  // this.title instanceof String ?
  // new RegularTextPageObjectComponent(`${this.headerBasePath} .d-none ${this.headerComponentName} .depository-name-container > `,
  // this.title.toString(), '16px') :
  // this.title as TextBasePageObjectComponent;
  public text: TextBasePageObjectComponent;
  public currencySelector = new CurrencySelectorPageObjectComponent();
  public portfolioBalance = new PortfolioBalancePageObjectComponent(`${this.basePath}`);
  public deltaValue = new DeltaValueSwitcherPageObjectComponent(`${this.basePath}`);
  public deltaPeriodSelector = new DeltaValueHistorySelectorPageObjectComponent();
}

import {BalanceNumberPageObjectComponent} from './balance-number.po';

export class PortfolioBalancePageObjectComponent extends BalanceNumberPageObjectComponent {

  constructor(basePath: string) {
    super(`${basePath} .d-none div.selected-currency`, '40px', '500');
  }
}

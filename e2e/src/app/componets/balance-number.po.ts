import {BasePageObjectComponent} from './base.po';
import {checkPattern, checkStyles} from '../../utils';
import {CurrencySvgIconPageObjectComponent} from './svg-icon.po';
import {DarkMutedTextPageObjectComponent, RegularTextPageObjectComponent} from './text.po';
import {by, element} from 'protractor';
import {NumberService} from '../../../../src/app/utils/rich-number/number.service';

export class BalanceNumberPageObjectComponent extends BasePageObjectComponent {
  constructor(basePath: string,
              protected fontSize: string = '16px',
              protected fontWeight: string = '400') {
    super(basePath, 'app-balance-number');
  }

  private numberService: NumberService = new NumberService();

  number = new RichNumberPageObjectComponent(this.basePath, this.fontSize, this.fontWeight);

  currencyIcon = new CurrencySvgIconPageObjectComponent(`${this.basePath}`, this.fontSize, this.fontWeight);

  public async assertBalanceText(balanceNumber: number, priceInUsd: number) {
    const actualBalance = await this.number.value.getText();
    const balanceRichNumber = this.numberService.toRichNumber(balanceNumber, priceInUsd);
    const expectedBalance = `${balanceRichNumber.meaningfulPart}${balanceRichNumber.notMeaningfulPart}`;
    await expect(actualBalance.trim().replace(/(?:\r\n|\r|\n)/g, ''))
      .toBe(expectedBalance, 'balance invalid');
  }

  public async assertNumber(selectedCurrency: string) {
    const selected = this.config.getCurrencyByName(selectedCurrency);
    await checkStyles(this.number.meaningfulPart.el, this.number.meaningfulPart.prop.style,
      `portfolio balance, sign part ${this.number.meaningfulPart} in currency ${selectedCurrency}`);
    await checkStyles(this.number.notMeaningfulPart.el, this.number.notMeaningfulPart.prop.style,
      `portfolio balance, not sign part ${this.number.notMeaningfulPart} in currency ${selectedCurrency}`);

    // check full balance number
    await checkPattern(await this.number.value.getText(), await selected.deltaPattern.positive);

    // if (selected.signPartPattern !== null) {
    //   expect(await signPart.getText()).toMatch(selected.signPartPattern);
    // } else {
    //   expect(await signPart.getText()).toEqual('');
    // }
    //
    // if (selected.notSignPartPattern !== null) {
    //   expect(await notSignPart.getText()).toMatch(selected.notSignPartPattern);
    // } else {
    //   expect(await notSignPart.getText()).toEqual('');
    // }
  }
}

export class RichNumberPageObjectComponent extends BasePageObjectComponent {
  constructor(basePath: string,
              protected fontSize: string = '16px',
              protected fontWeight: string = '400') {
    super(basePath, 'div');
  }

  value = element(by.css(`${this.basePath}`));

  meaningfulPart = new RegularTextPageObjectComponent(`${this.basePath} span:not(.dark-muted)`, '', this.fontSize);

  notMeaningfulPart = new DarkMutedTextPageObjectComponent(`${this.basePath} span.dark-muted`, '', this.fontSize);
}
